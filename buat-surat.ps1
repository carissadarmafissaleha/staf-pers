<#
.SYNOPSIS
    Skrip Otomasi Operator Staf Pers untuk membuat Surat Bentuk B (SIJ Luar Kotama).
.DESCRIPTION
    Menghasilkan Surat Bentuk B dari template di 'master-dokumen' ke folder 'hasil'
    dengan HANYA mengubah isian data variabel tanpa merusak tata letak, margin,
    font Arial, ukuran font, tabulasi, atau elemen visual dokumen.
#>

param(
    [string]$MasterPath = "master-dokumen\SURAT B AJU SIJ LUAR KOTAMA.docx",
    [string]$OutputFolder = "hasil",
    [string]$OutputFile = "",
    [string]$TanggalSurat = "",
    [string]$NomorSurat = "",
    [string]$Nama = "",
    [string]$PangkatNRP = "",
    [string]$Jabatan = "",
    [string]$Tujuan = "",
    [string]$Pengikut = "",
    [string]$Keperluan = "",
    [string]$Berangkat = "",
    [string]$Kembali = "",
    [string]$NomorHP = "",
    [string]$DanyonNama = "",
    [string]$DanyonPangkatNRP = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

if (-not (Test-Path $MasterPath)) {
    Write-Error "File master tidak ditemukan: $MasterPath"
    exit 1
}

if (-not (Test-Path $OutputFolder)) {
    New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null
}

# Tentukan nama file output bila tidak dispesifikasikan
if ([string]::IsNullOrWhiteSpace($OutputFile)) {
    $cleanName = if ($Nama) { $Nama.Trim() -replace '[\\/:*?"<>|]', '_' } else { "BARU" }
    $cleanPangkat = if ($PangkatNRP) { ($PangkatNRP -split '/')[0].Trim() -replace '[\\/:*?"<>|]', '_' } else { "" }
    if ($cleanPangkat) {
        $OutputFile = "SURAT B AJU SIJ LUAR KOTAMA - $cleanPangkat $cleanName.docx"
    } else {
        $OutputFile = "SURAT B AJU SIJ LUAR KOTAMA - $cleanName.docx"
    }
}

$DestinationPath = Join-Path $OutputFolder $OutputFile

# Salin master template ke tujuan
Copy-Item -Path $MasterPath -Destination $DestinationPath -Force

# Buka archive zip DOCX untuk memodifikasi word/document.xml
$zip = [System.IO.Compression.ZipFile]::Open($DestinationPath, [System.IO.Compression.ZipArchiveMode]::Update)
$docEntry = $zip.GetEntry("word/document.xml")

if ($null -eq $docEntry) {
    $zip.Dispose()
    Write-Error "word/document.xml tidak ditemukan di dalam berkas docx!"
    exit 1
}

$stream = $docEntry.Open()
$reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
$xmlText = $reader.ReadToEnd()
$reader.Close()
$stream.Close()

$xml = [xml]$xmlText
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
$ns.AddNamespace('w14', 'http://schemas.microsoft.com/office/word/2010/wordml')

# Helper function untuk mengganti teks setelah tanda titik dua (:) dalam satu paragraf
function Update-FieldValueAfterColon($pNode, [string]$newValue) {
    if ([string]::IsNullOrWhiteSpace($newValue)) { return }
    
    $runs = $pNode.SelectNodes('.//w:r', $ns)
    $colonIndex = -1
    for ($i = 0; $i -lt $runs.Count; $i++) {
        $tNodes = $runs[$i].SelectNodes('.//w:t', $ns)
        $rText = ($tNodes | ForEach-Object { $_.InnerText }) -join ''
        if ($rText.Contains(':')) {
            $colonIndex = $i
            break
        }
    }
    
    if ($colonIndex -ge 0) {
        # Ambil run pertama setelah titik dua untuk memuat nilai baru
        $valueRun = $null
        $removeRuns = @()
        for ($j = $colonIndex + 1; $j -lt $runs.Count; $j++) {
            if ($null -eq $valueRun) {
                $valueRun = $runs[$j]
            } else {
                $removeRuns += $runs[$j]
            }
        }
        
        if ($null -ne $valueRun) {
            $tNode = $valueRun.SelectSingleNode('.//w:t', $ns)
            if ($null -eq $tNode) {
                $tNode = $xml.CreateElement('w', 't', $ns.LookupNamespace('w'))
                $valueRun.AppendChild($tNode) | Out-Null
            }
            # Berikan spasi awal agar rapi
            $tNode.InnerText = " " + $newValue.Trim()
            $spaceAttr = $xml.CreateAttribute('xml', 'space', 'http://www.w3.org/XML/1998/namespace')
            $spaceAttr.Value = 'preserve'
            $tNode.Attributes.Append($spaceAttr) | Out-Null
            
            # Bersihkan run sisa dan proofErr
            foreach ($rem in $removeRuns) {
                if ($null -ne $rem.ParentNode) {
                    $rem.ParentNode.RemoveChild($rem) | Out-Null
                }
            }
            $proofErrs = $pNode.SelectNodes('.//w:proofErr', $ns)
            foreach ($pe in $proofErrs) {
                if ($null -ne $pe.ParentNode) {
                    $pe.ParentNode.RemoveChild($pe) | Out-Null
                }
            }
        } else {
            # Bila tidak ada run setelah titik dua, buat run baru dengan rPr dari titik dua
            $colonRun = $runs[$colonIndex]
            $newRun = $colonRun.CloneNode($true)
            $newT = $newRun.SelectSingleNode('.//w:t', $ns)
            $newT.InnerText = " " + $newValue.Trim()
            $spaceAttr = $xml.CreateAttribute('xml', 'space', 'http://www.w3.org/XML/1998/namespace')
            $spaceAttr.Value = 'preserve'
            $newT.Attributes.Append($spaceAttr) | Out-Null
            $pNode.AppendChild($newRun) | Out-Null
        }
    }
}

# 1. Update Isian Data Personel (Poin 2)
$bodyPs = $xml.SelectNodes('//w:body/w:p', $ns)
foreach ($p in $bodyPs) {
    $allText = ($p.SelectNodes('.//w:t', $ns) | ForEach-Object { $_.InnerText }) -join ''
    
    if ($Nama -and $allText -match '^\s*a\.\s*Nama') {
        Update-FieldValueAfterColon $p $Nama
    }
    elseif ($PangkatNRP -and $allText -match '^\s*b\.\s*Pangkat/NRP') {
        Update-FieldValueAfterColon $p $PangkatNRP
    }
    elseif ($Jabatan -and $allText -match '^\s*c\.\s*Jabatan') {
        Update-FieldValueAfterColon $p $Jabatan
    }
    elseif ($Tujuan -and $allText -match '^\s*d\.\s*Tujuan') {
        Update-FieldValueAfterColon $p $Tujuan
    }
    elseif ($Pengikut -and $allText -match '^\s*e\.\s*Pengikut') {
        Update-FieldValueAfterColon $p $Pengikut
    }
    elseif ($Keperluan -and $allText -match '^\s*f\.\s*Keperluan') {
        Update-FieldValueAfterColon $p $Keperluan
    }
    elseif ($Berangkat -and $allText -match '^\s*g\.\s*Berangkat tanggal') {
        Update-FieldValueAfterColon $p $Berangkat
    }
    elseif ($Kembali -and $allText -match '^\s*h\.\s*Kembali tanggal') {
        Update-FieldValueAfterColon $p $Kembali
    }
    elseif ($NomorHP -and $allText -match '^\s*i\.\s*Nomor HP') {
        Update-FieldValueAfterColon $p $NomorHP
    }
}

# 2. Update Tanggal Surat (misal: Langgur, 27 Februari 2024)
if (-not [string]::IsNullOrWhiteSpace($TanggalSurat)) {
    # Ambil hanya leaf paragraph (paragraf terdalam) agar tidak merusak wrapper paragraph/textbox
    $datePs = $xml.SelectNodes('//w:p[not(.//w:p) and contains(., "Langgur")]', $ns)
    foreach ($dp in $datePs) {
        $runs = $dp.SelectNodes('.//w:r', $ns)
        if ($runs.Count -gt 0) {
            $firstRun = $runs[0]
            $tNode = $firstRun.SelectSingleNode('.//w:t', $ns)
            if ($null -eq $tNode) {
                $tNode = $xml.CreateElement('w', 't', $ns.LookupNamespace('w'))
                $firstRun.AppendChild($tNode) | Out-Null
            }
            $tNode.InnerText = $TanggalSurat
            $spaceAttr = $xml.CreateAttribute('xml', 'space', 'http://www.w3.org/XML/1998/namespace')
            $spaceAttr.Value = 'preserve'
            $tNode.Attributes.Append($spaceAttr) | Out-Null

            for ($k = 1; $k -lt $runs.Count; $k++) {
                if ($null -ne $runs[$k].ParentNode) {
                    $runs[$k].ParentNode.RemoveChild($runs[$k]) | Out-Null
                }
            }
            $pes = $dp.SelectNodes('.//w:proofErr', $ns)
            foreach ($pe in $pes) {
                if ($null -ne $pe.ParentNode) {
                    $pe.ParentNode.RemoveChild($pe) | Out-Null
                }
            }
        }
    }
}

# 3. Update Nomor Surat (Nomor: B / 26 / II / 2024)
if (-not [string]::IsNullOrWhiteSpace($NomorSurat)) {
    $nomorP = $xml.SelectSingleNode('//w:body/w:p[contains(., "Nomor:")]', $ns)
    if ($nomorP) {
        $runs = $nomorP.SelectNodes('.//w:r', $ns)
        $colonRun = $null
        $valRun = $null
        $remRuns = @()
        
        # Formatkan nomor surat agar konsisten
        $formattedNomor = $NomorSurat.Trim()
        if (-not ($formattedNomor.StartsWith("B /") -or $formattedNomor.StartsWith("B/"))) {
            $formattedNomor = "B / " + $formattedNomor
        }

        foreach ($r in $runs) {
            $t = ($r.SelectNodes('.//w:t', $ns) | ForEach-Object { $_.InnerText }) -join ''
            if ($null -eq $colonRun) {
                if ($t.Contains(':')) {
                    $colonRun = $r
                }
            } else {
                # Hindari menghapus run terakhir jika itu hanya tabulasi
                $hasTabsOnly = ($r.SelectNodes('.//w:tab', $ns).Count -gt 0) -and ($r.SelectNodes('.//w:t', $ns).Count -eq 0)
                if (-not $hasTabsOnly) {
                    if ($null -eq $valRun) {
                        $valRun = $r
                    } else {
                        $remRuns += $r
                    }
                }
            }
        }
        
        if ($colonRun) {
            # Pastikan teks di colonRun hanya ":  "
            $cText = $colonRun.SelectSingleNode('.//w:t', $ns)
            if ($cText) {
                $cText.InnerText = ":  "
            }
        }
        
        if ($valRun) {
            $tNode = $valRun.SelectSingleNode('.//w:t', $ns)
            $tNode.InnerText = $formattedNomor
            $spaceAttr = $xml.CreateAttribute('xml', 'space', 'http://www.w3.org/XML/1998/namespace')
            $spaceAttr.Value = 'preserve'
            $tNode.Attributes.Append($spaceAttr) | Out-Null
            
            foreach ($rem in $remRuns) {
                if ($null -ne $rem.ParentNode) {
                    $rem.ParentNode.RemoveChild($rem) | Out-Null
                }
            }
            $pes = $nomorP.SelectNodes('.//w:proofErr', $ns)
            foreach ($pe in $pes) {
                if ($null -ne $pe.ParentNode) {
                    $pe.ParentNode.RemoveChild($pe) | Out-Null
                }
            }
        }
    }
}

# 4. Update Tanda Tangan Komandan (bila ada nama/nrp baru)
if ($DanyonNama -or $DanyonPangkatNRP) {
    $danyonPs = $xml.SelectNodes('//w:p[contains(., "Andi Agussalim")]', $ns)
    foreach ($dp in $danyonPs) {
        # update nama dan NRP di paragraph tanda tangan
        $runs = $dp.SelectNodes('.//w:r', $ns)
        foreach ($r in $runs) {
            $t = $r.SelectSingleNode('.//w:t', $ns)
            if ($t) {
                if ($DanyonNama -and $t.InnerText.Contains("Andi Agussalim")) {
                    $t.InnerText = $t.InnerText.Replace("Andi Agussalim, S.I.P.,M.I.P.", $DanyonNama)
                }
                if ($DanyonPangkatNRP -and $t.InnerText.Contains("11050039980883")) {
                    $t.InnerText = $t.InnerText.Replace("Mayor Inf NRP 11050039980883", $DanyonPangkatNRP)
                }
            }
        }
    }
}

# Simpan kembali XML ke dalam docx
$docEntry.Delete()
$newEntry = $zip.CreateEntry("word/document.xml", [System.IO.Compression.CompressionLevel]::Optimal)
$writeStream = $newEntry.Open()
$writer = New-Object System.IO.StreamWriter($writeStream, [System.Text.Encoding]::UTF8)
$xml.Save($writer)
$writer.Flush()
$writer.Close()
$writeStream.Close()

$zip.Dispose()

Write-Host "BERHASIL: Surat bentuk B telah dibuat di: $DestinationPath" -ForegroundColor Green
return $DestinationPath

$AssetsPath = $PSScriptRoot | Join-Path -ChildPath '..\lte-dev-helper-app\src\assets';
$FontIndexPath = $AssetsPath | Join-Path -ChildPath 'font-index.json';

class FontItem {
    [string]$Name;
    [System.Windows.Media.FontFamily]$FontFamily;
    [System.Windows.Media.Typeface]$Typeface;
    [System.Windows.Media.GlyphTypeface]$Glyph;
    [int]$CharacterCount;
    [double]$MaxHeight = 0.0;
    [double]$MaxWidth = 0.0;
    FontItem([System.Windows.Media.FontFamily]$FontFamily) {
        $this.Name = $FontFamily.FamilyNames['en-us'];
        $this.FontFamily = $FontFamily;
        $TypeFaces = @($FontFamily.GetTypefaces());
        foreach ($tf in $TypeFaces) {
            if ($tf.Style -eq [System.Windows.FontStyles]::Normal -and $tf.Weight -eq [System.Windows.FontWeights]::Normal -and $tf.Stretch -eq [System.Windows.FontStretches]::Normal) {
                $this.Typeface = $tf;
                break;
            }
        }
        if ($null -eq $this.Typeface) {
            foreach ($tf in $TypeFaces) {
                if ($tf.Style -eq [System.Windows.FontStyles]::Normal -and $tf.Stretch -eq [System.Windows.FontStretches]::Normal) {
                    $this.Typeface = $tf;
                    break;
                }
            }
            if ($null -eq $this.Typeface) {
                foreach ($tf in $TypeFaces) {
                    if ($tf.Weight -eq [System.Windows.FontWeights]::Normal -and $tf.Stretch -eq [System.Windows.FontStretches]::Normal) {
                        $this.Typeface = $tf;
                        break;
                    }
                }
                if ($null -eq $this.Typeface) {
                    foreach ($tf in $TypeFaces) {
                        if ($tf.Stretch -eq [System.Windows.FontStretches]::Normal) {
                            $this.Typeface = $tf;
                            break;
                        }
                    }
                    if ($null -eq $this.Typeface) { $this.Typeface = $TypeFaces[0] }
                }
            }
        }
        [System.Windows.Media.GlyphTypeface]$g = $null;
        if ($this.Typeface.TryGetGlyphTypeface([ref]$g)) {
            $this.CharacterCount = $g.CharacterToGlyphMap.Count;
            $this.Glyph = $g;
            $this.MaxHeight = $g.Height;
            foreach ($h in $g.AdvanceHeights.Values) {
                if ($h -gt $this.MaxHeight) { $this.MaxHeight = $h }
            }
            foreach ($h in $g.AdvanceWidths.Values) {
                if ($h -gt $this.MaxWidth) { $this.MaxWidth = $h }
            }
        } else {
            $this.CharacterCount = 0;
        }
    }
}

Write-Progress -Activity 'Getting font character counts' -Status 'Loading Unicode data' -PercentComplete 0;
if ($null -eq $Script:Ucd) {
    $Script:Ucd = [Xml]::new();
    $Script:Ucd.Load(($PSScriptRoot | Join-Path -ChildPath 'ucd.all.grouped.xml'));
    $Script:Nsmgr = [System.Xml.XmlNamespaceManager]::New($Script:Ucd.NameTable);
    $Script:Nsmgr.AddNamespace('ucd', 'http://www.unicode.org/ns/2003/ucd/1.0');
}
[PSObject[]]$ExistingFonts = @();
$ExistingFontNames = @();
if ($FontIndexPath | Test-Path -PathType Leaf) {
    $ExistingFonts = (Get-Content -LiteralPath $FontIndexPath) | ConvertFrom-Json;
    $ExistingFontNames = @($ExistingFonts | ForEach-Object { $_.name });
}

[double]$TotalCount = [System.Windows.Media.Fonts]::SystemFontFamilies.Count;
$Index = 0;
if ($null -eq $Script:FontFamilies) {
    $Script:FontFamilies = @(@([System.Windows.Media.Fonts]::SystemFontFamilies) | ForEach-Object {
        Write-Progress -Activity 'Getting font character counts' -Status $_.FamilyNames['en-us'] -PercentComplete ([int]((([double]$Index) * 100.0) / $TotalCount));
        $Index++;
        $charCount = 0;
        @($_.GetTypeFaces()) | ForEach-Object {
            [System.Windows.Media.GlyphTypeface]$Glyph = $null;
            if ($_.TryGetGlyphTypeface([ref]$Glyph) -and $Glyph.CharacterToGlyphMap.Count -gt $charCount) { $charCount = $Glyph.CharacterToGlyphMap.Count }
        }
        [FontItem]::new($_);
    } | Where-Object { $_.CharacterCount -gt 0 -and $ExistingFontNames -notcontains $_.Name });
}
Write-Progress -Activity 'Getting font character counts' -Status 'Completed' -PercentComplete 100 -Completed;
$SelectedFont = $Script:FontFamilies | ForEach-Object {
    [PSCustomObject]@{
        Name = $_.Name;
        'Character Count' = $_.CharacterCount;
    };
} | Out-GridView -Title 'Select font to add' -OutputMode Single;
if ($null -ne $SelectedFont) {
    $n = $SelectedFont.Name;
    $id = $ExistingFontNames.Count + 1;
    [FontItem]$Item = $Script:FontFamilies | Where-Object { $_.Name -eq $n } | Select-Object -First 1;
    $Script:FontFamilies = @($Script:FontFamilies | Where-Object { $_.Name -ne $n });
    $ExistingFonts += [PSCustomObject]@{
        id = $id;
        name = $n;
        lineSpacing = $Item.FontFamily.LineSpacing;
        maxHeight = $Item.MaxHeight;
        maxWidth = $Item.MaxWidth;
        characterCount = $Item.CharacterCount;
    };
    
    (ConvertTo-Json -InputObject $ExistingFonts -Depth 3) | Out-File -LiteralPath $FontIndexPath;
    
    if ($null -eq $Script:EntityDictionary) {
        [System.Xml.Resolvers.XmlPreloadedResolver]$Resolver = [System.Xml.Resolvers.XmlPreloadedResolver]::new([System.Xml.Resolvers.XmlKnownDtds]::Xhtml10);
        $Script:EntityDictionary = [System.Collections.Generic.Dictionary[int,[System.Management.Automation.PSObject]]]::new();
        $en = 0;
        @('xhtml-lat1.ent', 'xhtml-symbol.ent', 'xhtml-special.ent') | ForEach-Object {
            $en++;
            $EntitySet = [System.IO.Path]::GetFileNameWithoutExtension($_);
            $Path = $PSScriptRoot | Join-Path -ChildPath $_;
            $XmlDocument = [System.Xml.XmlDocument]::new();
            $XmlDocument.XmlResolver = $Resolver;
            $XmlDocument.LoadXml('<!DOCTYPE doc ['  + [System.IO.File]::ReadAllText($Path) + ']><html />');
            $XmlDocumentType = $XmlDocument.FirstChild;
            @($XmlDocumentType.Entities) | ForEach-Object {
                if ($_ -is [System.Xml.XmlEntity]) {
                    $TextNode = $null;
                    if ($_.HasChildNodes) { $TextNode = $_.ChildNodes | Where-Object { $_ -is [System.Xml.XmlText] } | Select-Object -First 1 }
                    if ($null -ne $TextNode) {
                        [char]$c = $TextNode.InnerText[0];
                        [int]$i = $c;
                        $Script:EntityDictionary.Add($i, ([PSCustomObject]@{
                            Name = $_.Name;
                            Value = $c;
                            EntitySet = $en
                        }));
                    } else {
                        switch ($_.Name) {
                            'quot' {
                                [int]$i = ([char]'"');
                                $Script:EntityDictionary.Add($i, ([PSCustomObject]@{
                                    Name = $_;
                                    Value = ([char]'"');
                                    EntitySet = $en
                                }));
                                break;
                            }
                            'amp' {
                                [int]$i = ([char]'&');
                                $Script:EntityDictionary.Add($i, ([PSCustomObject]@{
                                    Name = $_;
                                    Value = ([char]'&');
                                    EntitySet = $en
                                }));
                                break;
                            }
                            'lt' {
                                [int]$i = ([char]'<');
                                $Script:EntityDictionary.Add($i, ([PSCustomObject]@{
                                    Name = $_;
                                    Value = ([char]'<');
                                    EntitySet = $en
                                }));
                                break;
                            }
                            'gt' {
                                [int]$i = ([char]'>');
                                $Script:EntityDictionary.Add($i, ([PSCustomObject]@{
                                    Name = $_;
                                    Value = ([char]'>');
                                    EntitySet = $en
                                }));
                                break;
                            }
                            'apos' {
                                [int]$i = ([char]"'");
                                $Script:EntityDictionary.Add($i, ([PSCustomObject]@{
                                    Name = $_;
                                    Value = ([char]"'");
                                    EntitySet = $en
                                }));
                                break;
                            }
                            default {
                                Write-Warning -Message "Unknown entity $_ in $EntitySet";
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    [int[]]$CharCodes = @($Item.Glyph.CharacterToGlyphMap.Keys);
    $NonDisplayableCategories = @([System.Globalization.UnicodeCategory]::ModifierLetter, [System.Globalization.UnicodeCategory]::NonSpacingMark, [System.Globalization.UnicodeCategory]::SpaceSeparator,
        [System.Globalization.UnicodeCategory]::LineSeparator, [System.Globalization.UnicodeCategory]::ParagraphSeparator, [System.Globalization.UnicodeCategory]::Control,
        [System.Globalization.UnicodeCategory]::Format, [System.Globalization.UnicodeCategory]::Surrogate, [System.Globalization.UnicodeCategory]::ModifierSymbol);
    
    [double]$TotalCount = $CharCodes.Count;
    $Index = 0;
    (@($CharCodes | ForEach-Object {
        Write-Progress -Activity 'Getting character information' -Status $_.ToString('x2') -PercentComplete ([int]((([double]$Index) * 100.0) / $TotalCount));
        $Index++;
        [char]$c = $_;
        $Category = [char]::GetUnicodeCategory($c);
        [PSObject]$Entity = $null;
        $isWhiteSpace = [char]::IsWhiteSpace($c);
        if ($isWhiteSpace -or [char]::IsControl($c) -or $NonDisplayableCategories -contains $Category) {
            if ($Script:EntityDictionary.TryGetValue($_, [ref]$Entity)) {
                [PSCustomObject]@{
                    numericValue = $_;
                    name = $Entity.Name;
                    isWhiteSpace = $isWhiteSpace;
                    category = ([int]$Category);
                    entitySet = $Entity.EntitySet;
                };
            } else {
                [PSCustomObject]@{
                    numericValue = $_;
                    isWhiteSpace = $isWhiteSpace;
                    category = ([int]$Category);
                    entitySet = 0;
                };
            }
        } else {
            if ($Script:EntityDictionary.TryGetValue($_, [ref]$Entity)) {
                [PSCustomObject]@{
                    numericValue = $_;
                    value = $Entity.Value;
                    name = $Entity.Name;
                    isWhiteSpace = $false;
                    category = ([int]$Category);
                    entitySet = $Entity.EntitySet;
                };
            } else {
                [PSCustomObject]@{
                    numericValue = $_;
                    value = $c;
                    isWhiteSpace = $false;
                    category = ([int]$Category);
                    entitySet = 0;
                };
            }
        }
    } | ForEach-Object {
        $e = $Script:Ucd.DocumentElement.SelectSingleNode("ucd:repertoire/ucd:group/ucd:char[@cp=`"$($_.numericValue.ToString('X4'))`"]", $Script:Nsmgr);
        if ($null -ne $e) {
            $Description = $e.na;
            if ([string]::IsNullOrWhiteSpace($Description)) { $Description = $e.na1; }
            if ([string]::IsNullOrWhiteSpace($Description)) {
                $a = $e.SelectSingleNode('ucd:name-alias[@type="control"]', $Script:Nsmgr);
                if ($null -ne $a) { $Description = $a.alias }
                if ([string]::IsNullOrWhiteSpace($Description)) {
                    $a = $e.SelectSingleNode('ucd:name-alias[not(@type="abbreviation")]', $Script:Nsmgr);
                    if ($null -ne $a) { $Description = $a.alias }
                }
            }
            $Abbr = $null;
            $a = $e.SelectSingleNode('ucd:name-alias[@type="abbreviation"]', $Script:Nsmgr);
            if ($null -ne $a) { $Abbr = $a.alias }
            if (-not [string]::IsNullOrWhiteSpace($Description)) {
                $Description = @($Description.Trim() -split '\s+' | ForEach-Object {
                    if ($_.Length -eq 0) {
                        $_ | Write-Output;
                    } else {
                        ($_.SubString(0, 1) + $_.Substring(1).ToLower()) | Write-Output;
                    }
                }) -join ' ';
                $_ | Add-Member -MemberType NoteProperty -Name 'desc' -Value $Description;
            }
            if (-not [string]::IsNullOrWhiteSpace($Abbr)) {
                $_ | Add-Member -MemberType NoteProperty -Name 'abbr' -Value $Abbr;
            }
        }
        $_ | Write-Output;
    }) | ConvertTo-Json -Depth 3).Replace("\u0026", "&").Replace("\u0027", "'").Replace("\u003c", "<").Replace("\u003e", ">") | Out-File -LiteralPath ($AssetsPath | Join-Path -ChildPath "char-map$id.json");
    Write-Progress -Activity 'Getting character information' -Status 'Finished' -PercentComplete 100 -Completed;
}
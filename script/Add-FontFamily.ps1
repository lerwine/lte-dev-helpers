$AssetsPath = $PSScriptRoot | Join-Path -ChildPath '..\lte-dev-helper-app\src\assets';

$FontIndexPath = $AssetsPath | Join-Path -ChildPath 'font-index.json';
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
        [PSCustomObject]@{
            Font = $_;
            name = $_.FamilyNames['en-us'];
            characterCount = $charCount;
        }
    } | Where-Object { $_.characterCount -gt 0 -and $ExistingFontNames -notcontains $_.name });
    Write-Progress -Activity 'Getting font character counts' -Status 'Completed' -PercentComplete 100 -Completed;
}
$SelectedFont = $Script:FontFamilies | ForEach-Object {
    [PSCustomObject]@{
        Name = $_.name;
        'Character Count' = $_.characterCount;
    };
} | Out-GridView -Title 'Select font to add' -OutputMode Single;
if ($null -ne $SelectedFont) {
    $n = $SelectedFont.Name;
    $id = $ExistingFontNames.Count + 1;
    $Item = $Script:FontFamilies | Where-Object { $_.name -eq $n } | Select-Object -First 1;
    $Script:FontFamilies = @($Script:FontFamilies | Where-Object { $_.name -ne $n });
    $ExistingFonts += [PSCustomObject]@{
        id = $id;
        name = $n;
        characterCount = $Item.characterCount;
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
                        $HasGlyph = $DisplayChars -contains $i;
                        if (-not $HasGlyph) { $DisplayChars += $i }
                        $Script:EntityDictionary.Add($i, ([PSCustomObject]@{
                            Name = $_.Name;
                            Value = $c;
                            Encoded = "&#$i;";
                            HasGlyph = $HasGlyph;
                            EntitySet = $en
                        }));
                    } else {
                        switch ($_.Name) {
                            'quot' {
                                [int]$i = ([char]'"');
                                $HasGlyph = $DisplayChars -contains $i;
                                if (-not $HasGlyph) { $DisplayChars += $i }
                                $Script:EntityDictionary.Add($i, ([PSCustomObject]@{
                                    Name = $_;
                                    Value = ([char]'"');
                                    Encoded = "&quot;"
                                    HasGlyph = $HasGlyph;
                                    EntitySet = $en
                                }));
                                break;
                            }
                            'amp' {
                                [int]$i = ([char]'&');
                                $HasGlyph = $DisplayChars -contains $i;
                                if (-not $HasGlyph) { $DisplayChars += $i }
                                $Script:EntityDictionary.Add($i, ([PSCustomObject]@{
                                    Name = $_;
                                    Value = ([char]'&');
                                    Encoded = "&amp;"
                                    HasGlyph = $HasGlyph;
                                    EntitySet = $en
                                }));
                                break;
                            }
                            'lt' {
                                [int]$i = ([char]'<');
                                $HasGlyph = $DisplayChars -contains $i;
                                if (-not $HasGlyph) { $DisplayChars += $i }
                                $Script:EntityDictionary.Add($i, ([PSCustomObject]@{
                                    Name = $_;
                                    Value = ([char]'<');
                                    Encoded = "&lt;"
                                    HasGlyph = $HasGlyph;
                                    EntitySet = $en
                                }));
                                break;
                            }
                            'gt' {
                                [int]$i = ([char]'>');
                                $HasGlyph = $DisplayChars -contains $i;
                                if (-not $HasGlyph) { $DisplayChars += $i }
                                $Script:EntityDictionary.Add($i, ([PSCustomObject]@{
                                    Name = $_;
                                    Value = ([char]'>');
                                    Encoded = "&gt;"
                                    HasGlyph = $HasGlyph;
                                    EntitySet = $en
                                }));
                                break;
                            }
                            'apos' {
                                [int]$i = ([char]"'");
                                $HasGlyph = $DisplayChars -contains $i;
                                if (-not $HasGlyph) { $DisplayChars += $i }
                                $Script:EntityDictionary.Add($i, ([PSCustomObject]@{
                                    Name = $_;
                                    Value = ([char]"'");
                                    Encoded = "&apos;"
                                    HasGlyph = $HasGlyph;
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

    [int[]]$CharCodes = @();
    @($Item.Font.GetTypeFaces()) | ForEach-Object {
        [System.Windows.Media.GlyphTypeface]$Glyph = $null;
        if ($_.TryGetGlyphTypeface([ref]$Glyph) -and $Glyph.CharacterToGlyphMap.Count -eq $Item.characterCount) {
            [int[]]$CharCodes = @($Glyph.CharacterToGlyphMap.Keys);
        }
    }
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
                    value = $_;
                    name = $Entity.Name;
                    encoded = $Entity.Encoded;
                    isWhiteSpace = $isWhiteSpace;
                    category = ([int]$Category);
                    entitySet = $Entity.EntitySet;
                };
            } else {
                [PSCustomObject]@{
                    value = $_;
                    name = "#$_";
                    encoded = "&#$_;";
                    isWhiteSpace = $isWhiteSpace;
                    category = ([int]$Category);
                    entitySet = 0;
                };
            }
        } else {
            if ($Script:EntityDictionary.TryGetValue($_, [ref]$Entity)) {
                [PSCustomObject]@{
                    value = $_;
                    display = $Entity.Value;
                    name = $Entity.Name;
                    encoded = $Entity.Encoded;
                    isWhiteSpace = $false;
                    category = ([int]$Category);
                    entitySet = $Entity.EntitySet;
                };
            } else {
                [PSCustomObject]@{
                    value = $_;
                    display = $c;
                    name = "#$_";
                    encoded = "&#$_;";
                    isWhiteSpace = $false;
                    category = ([int]$Category);
                    entitySet = 0;
                };
            }
        }
    }) | ConvertTo-Json -Depth 3).Replace("\u0026", "&").Replace("\u0027", "'").Replace("\u003c", "<").Replace("\u003e", ">") | Out-File -LiteralPath ($AssetsPath | Join-Path -ChildPath "char-map$id.json");
    Write-Progress -Activity 'Getting character information' -Status 'Finished' -PercentComplete 100 -Completed;
}
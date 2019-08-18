
add-type @"
    using System.Net;
    using System.Security.Cryptography.X509Certificates;
    public class TrustAllCertsPolicy : ICertificatePolicy {
        public bool CheckValidationResult(
            ServicePoint srvPoint, X509Certificate certificate,
            WebRequest request, int certificateProblem) {
            return true;
        }
    }
"@
[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Ssl3, [Net.SecurityProtocolType]::Tls, [Net.SecurityProtocolType]::Tls11, [Net.SecurityProtocolType]::Tls12


$currentDAte = (Get-Date).GetDateTimeFormats()[3]
$months = @("01","02","03","04","05","06","07","08","09","10","11","12")
$days = (1..31)
$years = @("2019","2020")
$nights = "2"

$array = @()

Foreach ($year in $years)
{
    Foreach ($month in $months)
    {
    Write-Host -ForegroundColor Cyan -BackgroundColor Gray "$($year)"
        Foreach ( $day in $days)
        {
            $processdata = [datetime]"$month-$day-$year"
            if($processdata -ge $currentDAte)
            {
                Write-Host -ForegroundColor Cyan -BackgroundColor Gray "$($processdata)"
                $root = "https://res.windsurfercrs.com/ibe/default.aspx?hgID=641&langID=1&checkin=$($month)%2F$($day)%2F$($year)&nights=$($nights)&rooms=1&adults=2&children=0&promo=&iata=&group=&hotels=&ada=&currid=0"
                $Req = Invoke-WebRequest -Uri $root
                if ($Req.StatusCode -ne '200')
                {
                    break
                }
                $req0 = $req.ParsedHtml.body.getelementsbyclassname('ws-property-price')
                $req1 = $req.ParsedHtml.body.getelementsbyclassname('ws-property-title ws-item-title')

                $i = 0
                Foreach ($obj in $req0)
                {
                    $price = $obj.innerText.Split(' ')[0]
                    $price = $price.Replace('$','')
                    $hotel = $req1[$i].innerText
                    $hotel = ($hotel -split '\n')[0]
                    $remoteobj = New-Object PSCustomObject
                    $remoteobj | Add-Member -MemberType NoteProperty -Name Price -Value ([int]$price)
                    $remoteobj | Add-Member -MemberType NoteProperty -Name Hotel -Value $hotel
                    $remoteobj | Add-Member -MemberType NoteProperty -Name Date -Value ("$($month)/$($day)/$($year)")
                    $array += $remoteobj
                    $i++
                }
            }

        }

    }

}

$array = $array | where {$_.hotel -like 'Loews Portofino Bay Hotel*' -or $_.hotel -like 'Hard Rock Hotel*' -or $_.hotel -eq 'Loews Royal Pacific Resort*'}

$total = $array.count
$percentCheap = [Math]::Round($total*.1)
$avg = 
"Avg cost"
$array.price | measure-object -allstats


""
""
""
"10% Lowest of all values"
"----"
($array | Sort-Object -Property Price)[0-$percentCheap]


""
""
""
"Lowest to highest"
$array | Sort-Object -Property Price
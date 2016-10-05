# Outbound Push via Kudu Zip API 
param(
 
    $sitename = "devdemfwebapp",
    $resgrp =  "devdemrg",
    $sub = "External Demo Subscription",
    $SOURCEALIAS = "Source_Alias",
    $File = "wwwroot.ZIP"
    
)
 
$filePath = "$Sourcealias\$file"
Select-AzureRmSubscription -SubscriptionName $sub
[xml] $website =  Get-AzureRmWebAppPublishingProfile -Name $sitename -OutputFile test.xml -ResourceGroup $resgrp
$base64AuthInfo = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f $website.publishData.publishProfile.userName[0], $website.publishData.publishProfile.userPwd[0])))
$apiUrl = "https://$sitename.scm.azurewebsites.net/api/zip/site/wwwroot/"

Invoke-RestMethod -Uri $apiUrl -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Method PUT -InFile $filePath 

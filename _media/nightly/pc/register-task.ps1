# タスクスケジューラに「月〜金 1:47 に run-nightly.ps1 を実行」を登録する。
# 一度だけ、通常の PowerShell（管理者でなくてよい）で実行する:
#   powershell -ExecutionPolicy Bypass -File register-task.ps1
# 解除するとき:  Unregister-ScheduledTask -TaskName 'MyDataGuard News Nightly' -Confirm:$false

$Script  = Join-Path $PSScriptRoot 'run-nightly.ps1'
$Action  = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$Script`""
$Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday,Tuesday,Wednesday,Thursday,Friday -At '01:47'
$Settings = New-ScheduledTaskSettingsSet `
  -WakeToRun `
  -StartWhenAvailable `
  -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
  -ExecutionTimeLimit (New-TimeSpan -Hours 2)

Register-ScheduledTask -TaskName 'MyDataGuard News Nightly' -Action $Action -Trigger $Trigger -Settings $Settings `
  -Description 'MyDataGuard ニュースの下書きを作り、Pull Request にする' -Force | Out-Null

Write-Host '登録しました: MyDataGuard News Nightly（月〜金 1:47）'
Write-Host '今すぐ試すとき: Start-ScheduledTask -TaskName "MyDataGuard News Nightly"'

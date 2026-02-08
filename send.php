<?php
// 文字コード設定
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// 送信先メールアドレス
$to = 'v5h7umexd6sr1019sjeb@gmail.com';

// 件名
$subject = '【問合せ】ホームページ';

// フォームからのデータ取得（サニタイズ）
$name = isset($_POST['name']) ? htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8') : '';
$email = isset($_POST['email']) ? htmlspecialchars($_POST['email'], ENT_QUOTES, 'UTF-8') : '';
$inquiry_subject = isset($_POST['subject']) ? htmlspecialchars($_POST['subject'], ENT_QUOTES, 'UTF-8') : '';
$tel = isset($_POST['tel']) ? htmlspecialchars($_POST['tel'], ENT_QUOTES, 'UTF-8') : '';
$menu = isset($_POST['menu']) ? htmlspecialchars($_POST['menu'], ENT_QUOTES, 'UTF-8') : '';
$date1 = isset($_POST['date1']) ? htmlspecialchars($_POST['date1'], ENT_QUOTES, 'UTF-8') : '';
$time1 = isset($_POST['time1']) ? htmlspecialchars($_POST['time1'], ENT_QUOTES, 'UTF-8') : '';
$date2 = isset($_POST['date2']) ? htmlspecialchars($_POST['date2'], ENT_QUOTES, 'UTF-8') : '';
$time2 = isset($_POST['time2']) ? htmlspecialchars($_POST['time2'], ENT_QUOTES, 'UTF-8') : '';
$date3 = isset($_POST['date3']) ? htmlspecialchars($_POST['date3'], ENT_QUOTES, 'UTF-8') : '';
$time3 = isset($_POST['time3']) ? htmlspecialchars($_POST['time3'], ENT_QUOTES, 'UTF-8') : '';
$message = isset($_POST['message']) ? htmlspecialchars($_POST['message'], ENT_QUOTES, 'UTF-8') : '';

// 本文の作成
$body = "ホームページのお問い合わせフォームより以下の内容が送信されました。\n\n";
$body .= "【お名前】\n" . $name . "\n\n";
$body .= "【メールアドレス】\n" . $email . "\n\n";
$body .= "【件名】\n" . $inquiry_subject . "\n\n";
$body .= "【電話番号】\n" . $tel . "\n\n";
$body .= "【ご希望メニュー】\n" . $menu . "\n\n";

if ($date1 || $time1) {
    $body .= "【第1希望】\n" . $date1 . " " . $time1 . "\n\n";
}
if ($date2 || $time2) {
    $body .= "【第2希望】\n" . $date2 . " " . $time2 . "\n\n";
}
if ($date3 || $time3) {
    $body .= "【第3希望】\n" . $date3 . " " . $time3 . "\n\n";
}

$body .= "【お問い合わせ内容】\n" . $message . "\n\n";
$body .= "--------------------------------------------------\n";
$body .= "送信日時: " . date("Y/m/d H:i:s") . "\n";
$body .= "IPアドレス: " . $_SERVER['REMOTE_ADDR'] . "\n";

// ヘッダー設定（送信元をフォームのメールアドレスにするなど）
$headers = "From: " . mb_encode_mimeheader($name) . " <" . $email . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8";

// メール送信実行
$success = mb_send_mail($to, $subject, $body, $headers);

if ($success) {
    // 送信成功時：サンクスページへリダイレクト
    header("Location: thanks.html");
    exit;
} else {
    // 送信失敗時
    echo '<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>送信エラー</title>
<style>
body { font-family: "Noto Sans JP", sans-serif; text-align: center; padding: 50px; }
.error-box { border: 1px solid #d00; padding: 20px; max-width: 600px; margin: 0 auto; background: #fff0f0; }
h1 { color: #d00; }
a { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #333; color: #fff; text-decoration: none; border-radius: 4px; }
</style>
</head>
<body>
<div class="error-box">
<h1>送信エラー</h1>
<p>申し訳ありません。メールの送信に失敗しました。</p>
<p>サーバーの設定や一時的な不具合の可能性があります。</p>
<p>お手数ですが、電話（<a href="tel:0299960033" style="background:none;color:#333;padding:0;">0299-96-0033</a>）にてご連絡をお願いいたします。</p>
<a href="contact.html">フォームに戻る</a>
</div>
</body>
</html>';
}
?>

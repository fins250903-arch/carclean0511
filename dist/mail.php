<?php
mb_language("Japanese");
mb_internal_encoding("UTF-8");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

// Extract fields
$name = $input['name'] ?? '';
$email = $input['email'] ?? '';
$phone = $input['phone'] ?? '';
$zip = $input['zip'] ?? '';
$content = $input['content'] ?? '';

// Basic validation
if (empty($name) || empty($email) || empty($phone) || empty($zip) || empty($content)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Required fields missing']);
    exit;
}

// Admin Email Settings
$serviceName = '車内清掃「特急便」';
$toAdmin = 'info@carinteriorcleaning.jp';
$subjectAdmin = "【お問い合わせ】{$name}様より";
$bodyAdmin = "ホームページよりお問い合わせがありました。\n\n" .
    "お名前: {$name}\n" .
    "メールアドレス: {$email}\n" .
    "電話番号: {$phone}\n" .
    "郵便番号: {$zip}\n\n" .
    "お問い合わせ内容:\n{$content}\n\n" .
    "--------------------------------------------------\n" .
    "送信日時: " . date('Y-m-d H:i:s');

// User Auto-reply Settings
$subjectUser = "【{$serviceName}】お問い合わせありがとうございます";
$bodyUser = "{$name} 様\n\n" .
    "この度はお問い合わせいただきありがとうございます。\n" .
    "以下の内容で受け付けいたしました。\n" .
    "担当者より順次ご連絡させていただきますので、今しばらくお待ちください。\n\n" .
    "--------------------------------------------------\n" .
    "お名前: {$name}\n" .
    "メールアドレス: {$email}\n" .
    "電話番号: {$phone}\n" .
    "郵便番号: {$zip}\n\n" .
    "お問い合わせ内容:\n{$content}\n" .
    "--------------------------------------------------\n\n" .
    "※お急ぎの場合は、 070-8428-0866 までお電話ください。\n\n" .
    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n" .
    "{$serviceName}\n" .
    "WEB: https://carinteriorcleaning.jp/\n" .
    "━━━━━━━━━━━━━━━━━━━━━━━━━━";

// Header Settings
$headersAdmin = "From: no-reply@carinteriorcleaning.jp";
$headersUser = "From: info@carinteriorcleaning.jp";

// Send Emails
$adminSent = mb_send_mail($toAdmin, $subjectAdmin, $bodyAdmin, $headersAdmin);

if ($adminSent) {
    // Send auto-reply only if admin mail succeeds
    mb_send_mail($email, $subjectUser, $bodyUser, $headersUser);
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email']);
}
?>

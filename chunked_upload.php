<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $chunkIndex = isset($_POST['chunkIndex']) ? intval($_POST['chunkIndex']) : 0;
    $totalChunks = isset($_POST['totalChunks']) ? intval($_POST['totalChunks']) : 0;
    $fileName = isset($_POST['fileName']) ? $_POST['fileName'] : '';

    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $filePath = $uploadDir . $fileName;

    if (isset($_FILES['chunk']['tmp_name'])) {
        $chunk = $_FILES['chunk']['tmp_name'];

        $out = fopen($filePath, $chunkIndex === 0 ? 'wb' : 'ab');
        $in = fopen($chunk, 'rb');

        while ($buffer = fread($in, 4096)) {
            fwrite($out, $buffer);
        }

        fclose($in);
        fclose($out);

        unlink($chunk);

        if ($chunkIndex + 1 === $totalChunks) {
            echo 'آپلود فایل تکمیل شد.';
        } else {
            echo 'تکه دریافت شد.';
        }
    } else {
        error_log('خطا در دریافت تکه: فایل یافت نشد.');
        echo 'خطا در دریافت تکه.';
    }
} else {
    error_log('روش درخواست نامعتبر است.');
    echo 'روش درخواست نامعتبر است.';
}
?>

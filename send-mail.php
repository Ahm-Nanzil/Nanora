<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Composer


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    $mail = new PHPMailer(true);

    try {

        // SMTP Settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'ahmnanzil33@gmail.com';
        $mail->Password = 'iweyexsscbla ytc';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        // Sender & Receiver
        $mail->setFrom('nantech@gmail.com', 'Website Contact');
        $mail->addAddress('ahmnanzil33@gmail.com');

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body =
            "<h3>New Contact Message</h3>
            Name: $name <br>
            Email: $email <br>
            Message: $message";

        $mail->send();

        echo "Message Sent Successfully";

    } catch (Exception $e) {
        echo "Message Failed: {$mail->ErrorInfo}";
    }
}

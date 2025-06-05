package com.didan.webchat.user.util;

import com.didan.archetype.exception.BusinessException;
import com.didan.archetype.locale.Translator;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Random;
import javax.imageio.ImageIO;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ImageGenerateUtils {
  public static byte[] generateQrCode(String text, int width, int height) {
    QRCodeWriter qrCodeWriter = new QRCodeWriter();
    try {
      BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
      MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
      return outputStream.toByteArray();
    } catch (WriterException | IOException e) {
      throw new BusinessException(Translator.toLocale("msg.image.generate.error"));
    }
  }

  public static byte[] generateAvatar(String text, int size) {
    BufferedImage image = new BufferedImage(size, size, BufferedImage.TYPE_4BYTE_ABGR);
    Graphics2D graphics2D = image.createGraphics();
    Random random = new Random();
    Color backgroundColor;
    do {
      backgroundColor = new Color(random.nextInt(256), random.nextInt(256), random.nextInt(256));
    } while (backgroundColor.equals(Color.WHITE));
    graphics2D.setColor(backgroundColor);
    graphics2D.fillOval(0, 0, size, size);
    graphics2D.setColor(Color.WHITE);
    graphics2D.setFont(new Font("Arial", Font.BOLD, size / 2));
    FontMetrics fm = graphics2D.getFontMetrics();
    int x = (size - fm.stringWidth(String.valueOf(text.charAt(0)).toUpperCase())) / 2;
    int y = (size - fm.getHeight()) / 2 + fm.getAscent();
    graphics2D.drawString(String.valueOf(text.charAt(0)).toUpperCase(), x, y);
    graphics2D.dispose();
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    try {
      ImageIO.write(image, "PNG", outputStream);
    } catch (IOException e) {
      throw new BusinessException(Translator.toLocale("msg.image.generate.error"));
    }
    return outputStream.toByteArray();
  }
}

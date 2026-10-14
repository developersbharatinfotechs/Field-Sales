import 'dart:io';
import 'package:flutter/foundation.dart';

/// Centralized API configuration for the Kshetra Employee application.
class ApiConfig {
  /// Default production API URL pointing to the deployed Render backend.
  static const String defaultProductionUrl = 'https://field-sales-uq47.onrender.com';

  /// Resolves the base API URL to communicate with the backend.
  ///
  /// Priority order:
  /// 1. `--dart-define=API_URL=...` compile-time environment variable if supplied.
  /// 2. In Debug Mode:
  ///    - Android emulator uses `http://10.0.2.2:3000`.
  ///    - Web/Desktop/iOS uses `http://localhost:3000`.
  /// 3. In Release Mode / Production builds (default):
  ///    - Uses [defaultProductionUrl] (`https://field-sales-uq47.onrender.com`).
  static String get baseUrl {
    if (const bool.hasEnvironment('API_URL')) {
      final envUrl = const String.fromEnvironment('API_URL').trim();
      if (envUrl.isNotEmpty) {
        return _sanitizeUrl(envUrl);
      }
    }

    if (kDebugMode) {
      if (!kIsWeb && Platform.isAndroid) {
        return 'http://10.0.2.2:3000';
      }
      return 'http://localhost:3000';
    }

    return defaultProductionUrl;
  }

  /// Removes trailing slashes to guarantee clean endpoint concatenation.
  static String _sanitizeUrl(String url) {
    if (url.endsWith('/')) {
      return url.substring(0, url.length - 1);
    }
    return url;
  }
}

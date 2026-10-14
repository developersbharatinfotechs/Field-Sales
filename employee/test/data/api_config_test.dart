import 'package:flutter_test/flutter_test.dart';
import 'package:Kshetra/data/api_config.dart';

void main() {
  group('ApiConfig', () {
    test('defaultProductionUrl is pointing to the correct Render backend', () {
      expect(ApiConfig.defaultProductionUrl, 'https://field-sales-uq47.onrender.com');
    });

    test('baseUrl returns a non-empty, valid URL with no trailing slash', () {
      final url = ApiConfig.baseUrl;
      expect(url.isNotEmpty, isTrue);
      expect(url.endsWith('/'), isFalse);
      expect(url.startsWith('http://') || url.startsWith('https://'), isTrue);
    });
  });
}

# Example configuration

```yaml
mode: local-first
retention_days: 93
external_llm_enabled: false
skills:
  sms_filter:
    enabled: false
    consent_required: true
  bank_classifier:
    enabled: false
    consent_required: true
  family_urgent:
    enabled: false
    consent_required: true
  call_filter:
    enabled: false
    consent_required: true
  whatsapp_fyi:
    enabled: false
    consent_required: true
sync:
  enabled: false
  endpoint: null
```

Do not place a real device token, API key, private key, contact identifier, or account identifier in this file. Store secrets in an OS keychain or deployment secret manager. Platform secure-enclave support must be detected and verified by a native integration; a web UI cannot guarantee it.

# call_filter

This directory contains a deliberately minimal C interface example, not a functioning classifier. The source returns no positive matches and does not inspect message content. A production implementation needs a threat model, reviewed classification rules, a pinned WASM compiler, fuzzing, memory/fuel limits, and a privacy review before compilation or release.

The matching `.wasm` artifact is not included. Build it in a controlled environment and record the compiler version and artifact checksum.

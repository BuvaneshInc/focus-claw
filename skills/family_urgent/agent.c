/* Focus Claw skill interface example: family_urgent.
 * Source only. Compile to WASM with a pinned toolchain and audit before enabling.
 * Input is a small JSON classification descriptor, never raw message content.
 */
#include <stddef.h>
#include <string.h>

int focus_claw_skill_version(void) { return 1; }

/* Return 1 when the host should request a review; 0 otherwise.
 * This placeholder intentionally does not classify real messages.
 */
int focus_claw_classify(const char *label, size_t length) {
  (void)label;
  (void)length;
  return 0;
}

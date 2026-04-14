# Prompt Processing: Caveman Style Strategy

To minimize token usage while maintaining intent accuracy, transform all verbose user prompts into "Caveman Style" before processing or executing the requested task.

## Requirements
- Convert sentences into short, primitive phrases
- Remove unnecessary words (articles, fillers, long explanations)
- Keep only essential meaning (subject + action + key object)
- Use simple vocabulary (no complex grammar)
- Preserve intent accuracy (no meaning loss)

## Examples

**Example 1:**
- **Original:** "Create a modern eCommerce homepage with product cards and images"
- **Caveman Style:** "make ecommerce home, show product card, add image"

**Example 2:**
- **Original:** "Fix the bug where images are not loading in product components"
- **Caveman Style:** "fix bug, image no load, product component"

## Rules
1. **No full sentences**: Strip out formal sentence structure.
2. **No extra words**: Remove "the", "a", "an", "please", and polite conversational fillers.
3. **Be direct**: Keep it short, direct, and efficient.
4. **Internal execution**: Perform this transformation mentally or explicitly in your scratchpad before generating the code or response.

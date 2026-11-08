# Local Course History Requirements

- WHEN stored course history is a valid array, reloading shall preserve its entries.
- WHEN stored course history is removed, reloading shall clear the in-memory history.
- IF stored course history contains invalid JSON or a non-array value, reloading shall return an empty history without throwing.
- WHEN a course is visited after invalid history is encountered, the new visit shall be saved successfully.

# DQ9 Grotto Searcher
A powerful Grotto search tool created by using Claude and Gemini.

Based on reverse-engineered database, dq9tmap101.exe's ElistOfs logic, and some edge cases fixed by TKG and Claude.

Improvements from legacy DQ9 Grotto search tools
- Fixed misjudgments (such as misjudging Single Monster Floor into No-enemy Floor, etc.) by fixing ElistOfs logic by TKG
- Fixed Softlock (危険？ハマる地図 in Japanese, floor Seed 0x5BC7)'s by referring Yab's DQ9 Tool then fixing reverse-engineered database by Claude
- Deciphered Multibug phenomenon and implemented Multibug special floor searching by Claude and Gemini

For details, please see Disclaimer inside the tool.

# Available Search Functions

Ultimate search
- Grotto Name, Level
- Environment, SMR(B1 Monster Rank), Depth, Boss
- Location, Base Quality
- Chest counts by various Chest rank
- Wandering Monster bugged floor Status (ElistOfs)
- Single monster floor (Only)

Other searches
- Quickload B3/B4 same item x2 (QL)
- Quickload + 3rd Chest same item (Combo)
- 3rd Chest same item x2 (3rd)
- 3rd Chest Sainted Soma x2 (S3)
- Quickload B9 same item x2 (B9F)
- Quickload + 3rd Chest Sainted Soma (J-Fire)
- 4-player Multiplay Bug (Multibug)
- AT search for player developing Map Method (AT)

# Minimum requirements

iOS 10.3+ / Android 6.0+ / Windows 7+ / Any other OS which can run:

Chrome 55+ / Firefox 52+ / Edge 15+ / Safari 10.1+

CPU with high single thread efficiency

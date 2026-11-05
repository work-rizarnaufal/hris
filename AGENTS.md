# AI Agent Instructions: Anti-Slop, Ponytail & Mandatory Atomic UI

Every AI agent or assistant operating on this repository **MUST** adhere to the following standards and automatically apply the skills located in `.agents/skills/`:

## 1. Skill `antislop` (`.agents/skills/antislop/SKILL.md`)
- **Code Hygiene**:
  - Strip decorative banner comments (`// =======`, `/* ----- */`) and obvious tautological comments (`// set x to y`). Only comment subtle business logic or non-obvious edge cases.
  - No speculative abstractions, generic factories, or extra wrapper layers. Keep code direct, transparent, and maintainable.
- **UI Design**:
  - Purposeful, domain-tailored, high-information-density UI.
  - Follow the locked brand tokens defined in `resources/js/config/theme.js` (Deep Navy `#10273f` and Gold `#c4a266`).
  - No generic pastel cards or wasted whitespace.
- **Communication**:
  - Direct, factual, and concise in Indonesian/English as prompted.
  - Strictly avoid AI clichés ("delve into", "in today's fast-paced world", "seamless", "elevate", "testament").

## 2. Skill `ponytail` (`.agents/skills/ponytail/SKILL.md`)
- **YAGNI Ladder**: If a feature or abstraction is not strictly needed right now, do not build it.
- **Smallest Correct Patch**: Make surgical, minimal modifications that cleanly solve the user's task.
- **Safety First**: Never compromise CSRF, data validation, or security integrity.

## 3. Mandatory Atomic Component Reuse (Konsistensi UI)
- **Aturan Wajib**: Selalu gunakan dan perluas komponen atomik yang ada di [`resources/js/components/ui/`](resources/js/components/ui/) untuk menjaga konsistensi desain sistem:
  - **Tabel & Toolbar**: `<Table>`, `<TableHeader>`, `<TableBody>`, `<TableRow>`, `<TableHead>`, `<TableCell>`, `<TableEmpty>`, `<TableToolbar>`, `<TableSearch>`, `<TableFilterGroup>`, `<TableSelect>`.
  - **Dialog & Popup**: `<Modal>`, `<ModalHeader>`, `<ModalBody>`, `<ModalFooter>` (dilarang membuat modal/dialog floating kustom terpisah di file halaman).
  - **Notifikasi**: `<Toast toast={alertInfo} onClose={() => setAlertInfo(null)} />` (wajib menggunakan komponen Toast atomik, dilarang membuat alert floating inline manual).
  - **Struktur Kartu & Kontainer**: `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`, `<PageHeader>`, `<PageContainer>`.
  - **Elemen Interaktif**: `<Button>` (gunakan varian yang tersedia: `primary`, `secondary`, `outline`, `ghost`, `danger`), `<Badge>`, `<Input>`.
  - **Dokumen & Cetak (Print System)**: `<PrintButton>`, `<PrintHeader>`, `<PrintSignature>`, `<PrintOnly>`, `<PrintHidden>` ([`print.jsx`](resources/js/components/ui/print.jsx)).
- **Dilarang Duplikasi**: Jangan membuat ulang komponen dengan variasi sendiri di dalam halaman jika komponen atomik sudah tersedia.

## 4. Project Documentation
- Catat seluruh modul yang selesai dibangun, pembersihan dependensi, dan keputusan arsitektur di [`LAPORAN_PROYEK_HRIS.md`](LAPORAN_PROYEK_HRIS.md).

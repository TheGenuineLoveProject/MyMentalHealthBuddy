export async function journalingSaver(content: string) {
  return { status: 'saved-mock', id: 'journal_' + Date.now(), content };
}
export default defineEventHandler(async (event) => {
  const log = useLogger(event)

  log.set({ route: 'root' })

  return 'I love Banh Mi'
})

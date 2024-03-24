export const scanInputForBadWords = async (source: number, context: string, input: string): Promise<boolean> => {
  return await exports['blrp_core']['ScanInputForBadWords'](source, context, input)
}

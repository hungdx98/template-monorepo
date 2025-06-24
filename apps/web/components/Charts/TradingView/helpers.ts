export const mapResolutionToTimeFormat = (res: string | number) => {
  if (Number(res)) {
    const hours = Math.floor(Number(res) / 60)
    if (hours >= 1) return `${hours}H` // Return hours if greater than 0
    return `${res}m` // Return minutes if less than 60
  }
  return res
}

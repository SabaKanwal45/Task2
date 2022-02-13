/* Mock Response Object to Run Unit Tests on Controllers*/
const MockResponse = () => {
  const res:any = {}
  res.status = jest.fn(() => {
  }).mockReturnValue(res)
  res.json = jest.fn((jsonData:any) => {
    res.jsonData = jsonData
  }).mockReturnValue(res)
  return res
}
export default MockResponse

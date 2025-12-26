function ParkingHistory() {
  return (
    <div className="history-card">
      <h4>Recent Parking History</h4>

      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>Slot</th>
            <th>Duration</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Downtown</td>
            <td>A1</td>
            <td>2 hrs</td>
            <td>₹250</td>
          </tr>
          <tr>
            <td>City Mall</td>
            <td>C4</td>
            <td>1 hr</td>
            <td>₹150</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ParkingHistory;

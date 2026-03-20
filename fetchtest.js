const fs = require('fs');
fetch('https://app.hygraph.com/clone/ad627648114e4f7ca0747f4f60dfc107?name=Employee%20Payslip', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: '{ employees { employeeName employeeId designation department dateOfJoining bankName bankAccountNo panNo uanNo pfNo company } }' })
})
  .then(r => r.json())
  .then(r => fs.writeFileSync('temp_data.json', JSON.stringify(r.data.employees, null, 2)))
  .catch(console.error);

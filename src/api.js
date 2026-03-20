const PROXY_URL = 'http://localhost:4000/api/graphql';
//jhhgfk
const EMPLOYEES_QUERY = `
  query GetEmployees {
    employees {
      employeeName
      employeeId
      designation
      department
      dateOfJoining
      bankName
      bankAccountNo
      panNo
      uanNo
      pfNo
      company
    }
  }
`;

export const getEmployees = async (company = "") => {
  try {
    const res  = await fetch(PROXY_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ query: EMPLOYEES_QUERY }),
    });
    const { data, errors } = await res.json();

    if (errors?.length) throw new Error(errors[0].message);
    if (!data?.employees?.length) throw new Error("Employee data not found");

    const emps = data.employees.map(emp => ({
      ...emp,
      name:          emp.employeeName,
      accountNumber: emp.bankAccountNo,
      pan:           emp.panNo,
    }));

    return company
      ? emps.filter(emp => emp.company?.toLowerCase() === company.toLowerCase())
      : emps;

  } catch (error) {
    console.error("Fetch failed, falling back to mock data:", error);
    // Fallback data — mirrors actual Hygraph records
    const mock = [
      { name: "Manjula Devi", employeeId: "KK15", designation: "Dot Net Developer",  department: "", dateOfJoining: "2026-03-01", bankName: "Not Assigned", accountNumber: "Not Assigned", pan: "124578la+78c",  uanNo: "xsjsp88888457", pfNo: "7418596gh",      company: "avs" },
      { name: "Durga",        employeeId: "DD20", designation: "Software Developer", department: "", dateOfJoining: "2025-07-21", bankName: "IOB",          accountNumber: "IOB123456",    pan: "PAN123456",     uanNo: "UAN1123234",    pfNo: "PF2324356478",  company: "avs" },
      { name: "Meena",        employeeId: "DD25", designation: "Developer",          department: "", dateOfJoining: "2026-03-01", bankName: "Not Assigned", accountNumber: "Not Assigned", pan: "74185296lmkj",  uanNo: "74185ujnyb",    pfNo: "fghcvb52741963",company: "avs" },
      { name: "Shabu",        employeeId: "DD21", designation: "Software Developer", department: "", dateOfJoining: "2025-08-21", bankName: "SBI",          accountNumber: "SBI123456ned", pan: "PAN12345",      uanNo: "UAN12334567",   pfNo: "PF1234567",     company: "kaaikani" },
      { name: "Arjun",        employeeId: "DD22", designation: "Software",           department: "", dateOfJoining: "2026-03-18", bankName: "Not Assigned", accountNumber: "Not Assigned", pan: "",              uanNo: "",              pfNo: "",              company: "kaaikani" },
    ];
    return company
      ? mock.filter(e => e.company === company.toLowerCase())
      : mock;
  }
};

const PROXY_URL = '/api/graphql';
const EMPLOYEES_QUERY = `
  query GetEmployees {
    employees(first: 100) {
      id
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
    console.error("Failed to fetch employees from Hygraph:", error);
    throw error;
  }
};

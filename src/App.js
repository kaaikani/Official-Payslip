import { useEffect, useState, useRef } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getEmployees } from "./api";
import Dropdown from "./components/Dropdown";
import PayslipCard from "./components/PayslipCard";
import "./App.css";

function App() {
  const [employees, setEmployees]       = useState([]);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [error, setError]               = useState("");
  const [isLoading, setIsLoading]       = useState(true);
  const [selectedCompany, setSelectedCompany] = useState("avs");
  const [isDownloading, setIsDownloading] = useState(false);

  const payslipRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    setSelectedPayslip(null);
    getEmployees(selectedCompany)
      .then(data => {
        setEmployees(data || []);
        setError("");
      })
      .catch(err => {
        setError(err.message || "Employee data not found");
        setEmployees([]);
      })
      .finally(() => setIsLoading(false));
  }, [selectedCompany]);

  const handleSelectEmployee = (empId) => {
    const employee = employees.find(emp => emp.employeeId === empId);
    if (!employee) return;

    const now = new Date();
    const payMonth = now.toLocaleString('default', { month: 'long' });
    const payYear  = now.getFullYear().toString();

    setSelectedPayslip({
      employee: {
        name:          employee.name,
        employeeId:    employee.employeeId,
        designation:   employee.designation,
        department:    employee.department || '',
        dateOfJoining: employee.dateOfJoining || '',
        bankName:      employee.bankName || '',
        accountNumber: employee.accountNumber || '',
        pan:           employee.pan || '',
        uanNo:         employee.uanNo || '',
        pfNo:          employee.pfNo || '',
      },
      earning:    [],
      deduction:  [],
      payMonth,
      payYear,
    });
  };

  const handleAddEarning = () =>
    setSelectedPayslip(prev => ({
      ...prev,
      earning: [...prev.earning, { title: "", amount: 0 }],
    }));

  const handleAddDeduction = () =>
    setSelectedPayslip(prev => ({
      ...prev,
      deduction: [...prev.deduction, { title: "", amount: 0 }],
    }));

  const handleUpdateItem = (type, index, field, value) =>
    setSelectedPayslip(prev => {
      const list = [...prev[type]];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [type]: list };
    });

  const handleUpdatePayInfo = (field, value) =>
    setSelectedPayslip(prev => ({ ...prev, [field]: value }));

  const handleDownloadPdf = async () => {
    if (!payslipRef.current) return;
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    try {
      const canvas  = await html2canvas(payslipRef.current, { scale: 2, useCORS: true });
      const pdf     = new jsPDF('p', 'mm', 'a4');
      const width   = pdf.internal.pageSize.getWidth();
      const height  = (canvas.height * width) / canvas.width;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, height);
      pdf.save(`Payslip_${selectedPayslip.employee?.employeeId || 'download'}.pdf`);
    } catch {
      alert("Failed to generate PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (error)    return <div className="full-center loading-state"><h2>{error}</h2></div>;
  if (isLoading) return <div className="full-center loading-state"><div className="spinner"></div><h2>Loading employee data...</h2></div>;
  if (!employees.length) return <div className="full-center loading-state"><h2>No employee records available</h2></div>;

  return (
    <div className="admin-layout">
      <nav className="navbar">
        <div className="nav-brand">HR Payroll System</div>
      </nav>

      <main className="main-content">
        <div className="dashboard-view">
          <div className="control-panel card-ui">
            <div className="filter-row" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="dropdown-row" style={{ display: 'flex', gap: '2rem', width: '100%', alignItems: 'flex-end' }}>
                <div className="dropdown-container" style={{ flex: 1 }}>
                  <label className="dropdown-label">Select Company:</label>
                  <div className="select-wrapper">
                    <select
                      className="employee-dropdown"
                      value={selectedCompany}
                      onChange={e => setSelectedCompany(e.target.value)}
                    >
                      <option value="avs">AVS</option>
                      <option value="kaaikani">Kaaikani</option>
                    </select>
                  </div>
                </div>

                <div className="dropdown-container" style={{ flex: 1 }}>
                  <label className="dropdown-label">Select Employee:</label>
                  <Dropdown
                    employees={employees}
                    selectedEmployeeId={selectedPayslip?.employee?.employeeId}
                    onSelect={handleSelectEmployee}
                  />
                </div>
              </div>
            </div>
          </div>

          {selectedPayslip ? (
            <div className="payslip-display-area">
              <PayslipCard
                data={selectedPayslip}
                onAddEarning={handleAddEarning}
                onAddDeduction={handleAddDeduction}
                onUpdateItem={handleUpdateItem}
                onUpdatePayInfo={handleUpdatePayInfo}
                targetRef={payslipRef}
                isDownloading={isDownloading}
              />
              <div className="download-section card-ui text-center">
                <button className="btn btn-primary btn-lg" onClick={handleDownloadPdf}>
                  Download Payslip
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <h3>No Employee Selected</h3>
              <p>Please select an employee from the dropdown to view and manage their payslip.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="footer-box">
        <p>&copy; Kaikani</p>
      </footer>
    </div>
  );
}

export default App;

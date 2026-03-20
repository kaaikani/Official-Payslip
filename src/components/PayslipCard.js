const numberToWords = (num) => {
    if (num <= 0) return "Zero";
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
               'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const convert = (n) => {
        if (n < 20)       return a[n];
        if (n < 100)      return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
        if (n < 1000)     return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
        if (n < 100000)   return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
        if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
        return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
    };
    return convert(num);
};

const EditableCell = ({ isDownloading, value, onChange, type = "text", placeholder }) =>
    isDownloading
        ? <span>{value}</span>
        : <input type={type} className={`minimal-input corp-input${type === "number" ? " text-right" : ""}`} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />;

const PayslipCard = ({ data, onAddEarning, onAddDeduction, onUpdateItem, onUpdatePayInfo, targetRef, isDownloading }) => {
    const earnings   = data.earning   || [];
    const deductions = data.deduction || [];

    const grossEarnings   = earnings.reduce((sum, item)   => sum + (Number(item.amount) || 0), 0);
    const totalDeductions = deductions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const netPay          = Math.max(0, grossEarnings - totalDeductions);

    return (
        <div className="payslip-wrapper corporate-payslip-wrapper">
            <div className="corporate-payslip" ref={targetRef}>

                <header className="payslip-header-corporate">
                    <div className="header-top-row">
                        <div className="header-left-group">
                            <div className="logo-box-corporate">
                                <img
                                    src="/logo.png"
                                    alt="Company Logo"
                                    className="company-logo-img corporate-logo"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="logo-brand-bg fallback-logo-corporate" style={{ display: 'none' }}>
                                    <span className="logo-inner-text" style={{ fontWeight: 'bold' }}>KaaiKani</span>
                                </div>
                            </div>
                            <div className="header-text-corporate">
                                <h1 className="company-title-corporate">KaaiKani</h1>
                                <p className="address-corporate">1st FLOOR, THANGAM HOUSING-II, NO.8B, Thirumalai Naicker St, EXT, Kovil Pappakudi, Madurai, Tamil Nadu</p>
                            </div>
                        </div>
                    </div>

                    <div className="payslip-month-title">
                        Payslip for the Month of&nbsp;
                        {isDownloading ? (
                            <span>{data.payMonth} {data.payYear}</span>
                        ) : (
                            <>
                                <select className="month-year-select" value={data.payMonth || ''} onChange={e => onUpdatePayInfo('payMonth', e.target.value)}>
                                    <option value="">Month</option>
                                    {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                &nbsp;
                                <select className="month-year-select" value={data.payYear || ''} onChange={e => onUpdatePayInfo('payYear', e.target.value)}>
                                    <option value="">Year</option>
                                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </>
                        )}
                    </div>
                </header>

                <div className="corporate-divider"></div>

                <div className="employee-details-corporate">
                    <div className="details-col">
                        <table className="corporate-table details-table">
                            <tbody>
                                <tr><td className="corp-label">Employee Name</td><td className="corp-value">{data.employee?.name}</td></tr>
                                <tr><td className="corp-label">Employee ID</td><td className="corp-value">{data.employee?.employeeId}</td></tr>
                                <tr><td className="corp-label">Designation</td><td className="corp-value">{data.employee?.designation}</td></tr>
                                <tr><td className="corp-label">Department</td><td className="corp-value">{data.employee?.department}</td></tr>
                                <tr>
                                    <td className="corp-label">Date of Joining</td>
                                    <td className="corp-value">
                                        {data.employee?.dateOfJoining
                                            ? new Date(data.employee.dateOfJoining).toLocaleDateString('en-GB')
                                            : ''}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="details-col">
                        <table className="corporate-table details-table">
                            <tbody>
                                <tr>
                                    <td className="corp-label">Bank Name</td>
                                    <td className="corp-value">
                                        <EditableCell isDownloading={isDownloading} value={data.employee?.bankName || ''} onChange={v => onUpdatePayInfo('bankName', v)} placeholder="Enter bank name" />
                                    </td>
                                </tr>
                                <tr><td className="corp-label">Bank Account No</td><td className="corp-value">{data.employee?.accountNumber}</td></tr>
                                <tr><td className="corp-label">PAN No</td><td className="corp-value">{data.employee?.pan}</td></tr>
                                <tr><td className="corp-label">UAN No</td><td className="corp-value">{data.employee?.uanNo}</td></tr>
                                <tr><td className="corp-label">PF No</td><td className="corp-value">{data.employee?.pfNo}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="salary-section-corporate">
                    {[
                        { label: 'Earnings',   type: 'earning',   items: earnings,   total: grossEarnings,   totalLabel: 'Total Earnings',   onAdd: onAddEarning },
                        { label: 'Deductions', type: 'deduction', items: deductions, total: totalDeductions, totalLabel: 'Total Deductions', onAdd: onAddDeduction },
                    ].map(({ label, type, items, total, totalLabel, onAdd }) => (
                        <div key={type} className="salary-col">
                            <div className="salary-header salary-header--center">{label}</div>
                            <table className="corporate-table salary-table">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th className="text-right col-divider">Amount (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <EditableCell isDownloading={isDownloading} value={item.title} onChange={v => onUpdateItem(type, idx, 'title', v)} placeholder="Component Name" />
                                            </td>
                                            <td className="text-right col-divider">
                                                <EditableCell isDownloading={isDownloading} type="number" value={item.amount} onChange={v => onUpdateItem(type, idx, 'amount', v)} placeholder="0" />
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="summary-row">
                                        <td style={{ fontWeight: 'bold', borderTop: '1px solid #e5e7eb' }}>{totalLabel}</td>
                                        <td className="text-right col-divider" style={{ fontWeight: 'bold', borderTop: '1px solid #e5e7eb' }}>₹ {total.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            {!isDownloading && (
                                <div className="btn-row-corp">
                                    <button className="add-btn-corp" onClick={onAdd}>+ Add {label}</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="net-pay-banner">
                    <div className="net-pay-title">TOTAL NET PAYABLE</div>
                    <div className="net-pay-subtitle">Gross Earnings - Total Deductions</div>
                    <div className="net-pay-amount">Rs. {netPay.toFixed(2)}</div>
                    <div className="net-pay-words">Amount In Words: Indian Rupee {numberToWords(Math.round(netPay))} Only</div>
                </div>

                <div className="corporate-footer">
                    <p>-- This is a system-generated document. --</p>
                </div>

            </div>
        </div>
    );
};

export default PayslipCard;

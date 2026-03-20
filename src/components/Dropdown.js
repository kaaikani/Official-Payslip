import { useState, useRef, useEffect } from 'react';

const Dropdown = ({ employees, selectedEmployeeId, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen]         = useState(false);
    const dropdownRef                 = useRef(null);

    const selectedEmployee = employees.find(e => e.employeeId === selectedEmployeeId);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filtered = employees.filter(emp => {
        const term = searchTerm.toLowerCase();
        return (
            (emp.name || "").toLowerCase().includes(term) ||
            (emp.employeeId || "").toLowerCase().includes(term)
        );
    });

    const displayValue = isOpen
        ? searchTerm
        : selectedEmployee
            ? `${selectedEmployee.name} (${selectedEmployee.employeeId})`
            : "";

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <div className="searchable-dropdown">
                <input
                    type="text"
                    className="employee-dropdown"
                    placeholder="Search by name or ID..."
                    autoComplete="off"
                    value={displayValue}
                    onChange={e => { setSearchTerm(e.target.value); setIsOpen(true); }}
                    onFocus={() => { setIsOpen(true); setSearchTerm(""); }}
                />
                {isOpen && (
                    <div className="dropdown-list-container">
                        {filtered.length > 0 ? filtered.map(emp => (
                            <div
                                key={emp.employeeId}
                                className={`dropdown-item ${emp.employeeId === selectedEmployeeId ? 'selected' : ''}`}
                                onClick={() => { onSelect(emp.employeeId); setSearchTerm(""); setIsOpen(false); }}
                            >
                                <div className="emp-info">
                                    <span className="emp-name">{emp.name}</span>
                                    <span className="emp-id">{emp.employeeId}</span>
                                </div>
                                <div className="emp-dept">{emp.designation}</div>
                            </div>
                        )) : (
                            <div className="dropdown-no-results">No employees found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dropdown;

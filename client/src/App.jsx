import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://company-management-system-a8zn.onrender.com/api';

function App() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [deptName, setDeptName] = useState('');
  const [deptLocation, setDeptLocation] = useState('');
  const [editingDeptId, setEditingDeptId] = useState(null);

  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empDesignation, setEmpDesignation] = useState('');
  const [empSalary, setEmpSalary] = useState('');
  const [empDepartment, setEmpDepartment] = useState('');

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/departments/`);
      const deptData = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setDepartments(deptData);
    } catch (err) {
      console.error("Error fetching departments", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/employees/`);
      const empData = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setEmployees(empData);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDeptId) {
        await axios.put(`${API_BASE_URL}/departments/${editingDeptId}/`, { name: deptName, location: deptLocation });
        setEditingDeptId(null);
      } else {
        await axios.post(`${API_BASE_URL}/departments/`, { name: deptName, location: deptLocation });
      }
      setDeptName('');
      setDeptLocation('');
      fetchDepartments();
    } catch (err) {
      console.error("Error saving department", err);
      alert("Department save nahi ho paya!");
    }
  };

  const handleEmpSubmit = async (e) => {
    e.preventDefault();
    if (!empDepartment) {
      alert("Please select a department");
      return;
    }
    try {
      const empData = {
        name: empName,
        email: empEmail,
        designation: empDesignation,
        salary: empSalary,
        department: empDepartment
      };
      await axios.post(`${API_BASE_URL}/employees/`, empData);
      setEmpName('');
      setEmpEmail('');
      setEmpDesignation('');
      setEmpSalary('');
      setEmpDepartment('');
      fetchEmployees();
    } catch (err) {
      console.error("Error saving employee", err);
      alert("Employee save nahi ho paya!");
    }
  };

  const handleDeleteDept = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/departments/${id}/`);
      fetchDepartments();
    } catch (err) {
      console.error("Error deleting department", err);
    }
  };

  const handleDeleteEmp = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/employees/${id}/`);
      fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee", err);
    }
  };

  return (
    <div style={{ padding: '20px 10px', color: '#f3f4f6', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, sans-serif", boxSizing: 'border-box', overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 768px) {
          .dept-form {
            flex-direction: column !important;
          }
          .emp-form {
            display: flex !important;
            flex-direction: column !important;
          }
          .emp-form input, .emp-form select, .emp-form button {
            grid-column: span 1 !important;
          }
          .main-container {
            padding: 15px !important;
          }
          .custom-list-item {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .custom-list-item .action-buttons {
            width: 100% !important;
            display: flex !important;
            justify-content: flex-end !important;
            gap: 8px !important;
          }
        }
      `}</style>
      
      <div className="main-container" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', background: 'rgba(30, 41, 59, 0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '40px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', boxSizing: 'border-box' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px 0', lineHeight: '1.3' }}>Company Management System</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, lineHeight: '1.4' }}>Manage your departments and workforce seamlessly</p>
        </div>

        {/* Department Section */}
        <div style={{ marginBottom: '35px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#e2e8f0', borderBottom: '2px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px', marginBottom: '16px' }}>Manage Departments</h3>

          <form onSubmit={handleDeptSubmit} className="dept-form" style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Department Name" value={deptName} onChange={(e) => setDeptName(e.target.value)} required style={inputStyle} />
            <input type="text" placeholder="Location" value={deptLocation} onChange={(e) => setDeptLocation(e.target.value)} required style={inputStyle} />
            <button type="submit" style={{ ...primaryBtnStyle, width: '100%' }}>{editingDeptId ? 'Update' : 'Add Dept'}</button>
          </form>

          <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {departments.map(dept => (
              <li key={dept.id} className="custom-list-item" style={listItemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', overflow: 'hidden' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', flexShrink: 0 }}></span>
                  <span style={{ fontWeight: '500', wordBreak: 'break-word', lineHeight: '1.4' }}>{dept.name}</span>
                  <span style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.4' }}>({dept.location})</span>
                </div>
                <div className="action-buttons" style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => { setEditingDeptId(dept.id); setDeptName(dept.name); setDeptLocation(dept.location); }} style={editBtnStyle}>Edit</button>
                  <button onClick={() => handleDeleteDept(dept.id)} style={deleteBtnStyle}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Employee Section */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#e2e8f0', borderBottom: '2px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px', marginBottom: '16px' }}>Manage Employees</h3>

          <form onSubmit={handleEmpSubmit} className="emp-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <input type="text" placeholder="Employee Name" value={empName} onChange={(e) => setEmpName(e.target.value)} required style={inputStyle} />
            <input type="email" placeholder="Email Address" value={empEmail} onChange={(e) => setEmpEmail(e.target.value)} required style={inputStyle} />
            <input type="text" placeholder="Designation" value={empDesignation} onChange={(e) => setEmpDesignation(e.target.value)} required style={inputStyle} />
            <input type="number" placeholder="Salary (₹)" value={empSalary} onChange={(e) => setEmpSalary(e.target.value)} required style={inputStyle} />
            <select
              value={empDepartment}
              onChange={(e) => setEmpDepartment(e.target.value)}
              required
              style={{ ...inputStyle, gridColumn: 'span 2', cursor: 'pointer', width: '100%' }}
            >
              <option value="" style={{ background: '#0f172a', color: '#94a3b8' }}>Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id} style={{ background: '#0f172a', color: 'white' }}>
                  {dept.name}
                </option>
              ))}
            </select>
            <button type="submit" style={{ ...primaryBtnStyle, gridColumn: 'span 2', padding: '12px', fontWeight: '700', letterSpacing: '0.5px', width: '100%' }}>Add Employee</button>
          </form>

          <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {employees.map(emp => (
              <li key={emp.id} className="custom-list-item" style={listItemStyle}>
                <div style={{ wordBreak: 'break-word', paddingRight: '10px', overflow: 'hidden', width: '100%' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                    <strong style={{ color: '#f8fafc', fontSize: '15px', lineHeight: '1.4' }}>{emp.name}</strong>
                    <span style={{ color: '#818cf8', fontSize: '13px', lineHeight: '1.4' }}>({emp.designation})</span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', wordBreak: 'break-all' }}>
                    {emp.email} • <span style={{ color: '#34d399', fontWeight: '600' }}>₹{emp.salary}</span>
                  </div>
                </div>
                <div className="action-buttons" style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => handleDeleteEmp(emp.id)} style={deleteBtnStyle}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

// Reusable Professional Styles
const inputStyle = {
  flex: 1,
  width: '100%',
  padding: '11px 14px',
  background: 'rgba(15, 23, 42, 0.6)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '8px',
  outline: 'none',
  fontSize: '14px',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const primaryBtnStyle = {
  padding: '11px 20px',
  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
  boxSizing: 'border-box',
};

const listItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'rgba(15, 23, 42, 0.4)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  padding: '14px 18px',
  borderRadius: '10px',
  boxSizing: 'border-box',
  flexWrap: 'wrap',
  gap: '10px',
};

const editBtnStyle = {
  background: '#d97706',
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '600',
};

const deleteBtnStyle = {
  background: '#dc2626',
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '600',
};

export default App;

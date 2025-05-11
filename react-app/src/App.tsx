import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Student from "./ManageStudent/Student";
import './App.css'
import Drive from "./Vaccination/VaccinationDrives";
import Reports from "./Report/Reports";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ManageStudent/Student" element={<Student />} />
                <Route path="/Vaccination/VaccinationDrives" element={<Drive/>} />
                <Route path="/Report/Reports" element={<Reports/>} />
            </Routes>
        </Router>
    );
}

export default App;
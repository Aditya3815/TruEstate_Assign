import {
    LayoutDashboard,
    Files,
    ClipboardList,
    Zap,
    CheckCircle2,
    PauseCircle,
    XCircle,
    FileText, // For invoices
    FileCheck // For final invoices
} from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">V</div>
                <div className="logo-text">
                    <h2>Vault</h2>
                    <p>Anurag Yadav</p>
                </div>
                <button className="collapse-btn">v</button>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-item">
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </div>
                <div className="nav-item">
                    <Files size={20} />
                    <span>Nexus</span>
                </div>
                <div className="nav-item">
                    <ClipboardList size={20} />
                    <span>Intake</span>
                </div>

                <div className="nav-section">
                    <h3>SERVICES</h3>
                    <div className="nav-item">
                        <Zap size={20} />
                        <span>Pre-active</span>
                    </div>
                    <div className="nav-item active">
                        <CheckCircle2 size={20} />
                        <span>Active</span>
                    </div>
                    <div className="nav-item">
                        <PauseCircle size={20} />
                        <span>On-Hold</span>
                    </div>
                    <div className="nav-item">
                        <XCircle size={20} />
                        <span>Closed</span>
                    </div>
                </div>

                <div className="nav-section">
                    <h3>INVOICES</h3>
                    <div className="nav-item">
                        <FileText size={20} />
                        <span>Proforma Invoices</span>
                    </div>
                    <div className="nav-item">
                        <FileCheck size={20} />
                        <span>Final Invoices</span>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;

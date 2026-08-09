import streamlit as st
import time

# Page configuration
st.set_page_config(
    page_title="Staff Dashboard | Smart Queue",
    page_icon="🏛️",
    layout="wide"
)

# --- MOCK STATE MANAGEMENT (Connect to Member 4's DB via API later) ---
if "counter_active" not in st.session_state:
    st.session_state.counter_active = True

if "current_token" not in st.session_state:
    st.session_state.current_token = {
        "number": "INC-014",
        "name": "Ramesh Kumar",
        "category": "Senior Citizen",
        "service": "Income Certificate",
        "time": "10:15 AM"
    }

if "queue" not in st.session_state:
    st.session_state.queue = [
        {"number": "INC-015", "name": "Priya Sharma", "category": "General", "wait": "5 mins"},
        {"number": "INC-016", "name": "Amit Verma", "category": "PwD", "wait": "12 mins"},
        {"number": "INC-017", "name": "Sunita Devi", "category": "Pregnant", "wait": "18 mins"},
    ]

# --- HEADER SECTION ---
st.title("🏛️ Staff Portal — Smart Citizen Queue System")
st.caption("Municipal Service Centre | Departmental Counter Operations")

# Counter & Availability Bar
col_info, col_status = st.columns([3, 1])

with col_info:
    st.subheader("Assigned Counter: Counter 02 (Income Certificate)")

with col_status:
    # Counter availability toggle
    is_active = st.toggle("Counter Status (Active / On Break)", value=st.session_state.counter_active)
    st.session_state.counter_active = is_active
    
    if is_active:
        st.success("🟢 Counter Active")
    else:
        st.warning("🟡 On Break / Inactive")

st.divider()

# --- MAIN DASHBOARD LAYOUT ---
left_col, right_col = st.columns([2, 1])

# --- LEFT COLUMN: CURRENT CITIZEN & ACTIONS ---
with left_col:
    st.markdown("### 🎯 Currently Serving")
    
    if st.session_state.current_token and st.session_state.counter_active:
        token = st.session_state.current_token
        
        # Display Current Token Info Card
        with st.container(border=True):
            st.metric(label="Token Number", value=token["number"])
            
            c1, c2, c3 = st.columns(3)
            c1.write(f"**Citizen:** {token['name']}")
            c2.write(f"**Service:** {token['service']}")
            c3.write(f"**Priority:** :orange[{token['category']}]")

            st.divider()
            
            # Document Verification Status Tracking
            st.markdown("**📋 Document Verification Checklist**")
            id_check = st.checkbox("Identity Proof (Aadhaar / Voter ID)", value=True)
            form_check = st.checkbox("Application Form Completed", value=True)
            income_check = st.checkbox("Income Supporting Documents Attached", value=False)

            st.divider()
            
            # Workflow Action Buttons
            st.markdown("**Actions**")
            btn1, btn2, btn3 = st.columns(3)
            
            if btn1.button("✓ Complete", type="primary", use_container_width=True):
                st.toast(f"Token {token['number']} marked as Completed!")
                st.session_state.current_token = None
                st.rerun()

            if btn2.button("⚠️ Skip / Absent", use_container_width=True):
                st.toast(f"Token {token['number']} flagged as Skipped.")
                st.session_state.current_token = None
                st.rerun()

            if btn3.button("🔄 Redirect Counter", use_container_width=True):
                st.session_state.show_redirect_modal = True

        # Redirect Dialog/Form
        if st.session_state.get("show_redirect_modal", False):
            with st.form("redirect_form"):
                st.markdown("#### Redirect Citizen to Another Department")
                target_dept = st.selectbox("Select Target Service", [
                    "Birth/Death Certificate Counter",
                    "Welfare-Scheme Enquiry Counter",
                    "Supervisor Desk"
                ])
                reason = st.text_input("Reason for Redirect (Required for Audit Log)")
                submit = st.form_submit_button("Confirm Transfer")
                
                if submit and reason:
                    st.success(f"Token redirected to {target_dept}. Audit recorded.")
                    st.session_state.show_redirect_modal = False
                    st.session_state.current_token = None
                    st.rerun()
                elif submit and not reason:
                    st.error("Please provide a reason for redirecting.")

    elif not st.session_state.counter_active:
        st.info("Counter is marked as 'On Break'. Resume status to serve citizens.")
    else:
        st.info("No active token being served. Click 'Call Next Citizen' to proceed.")

    st.write("")
    
    # "Call Next Citizen" Primary Action
    if st.button("📢 Call Next Citizen", type="primary", use_container_width=True, disabled=not st.session_state.counter_active):
        if st.session_state.queue:
            next_token = st.session_state.queue.pop(0)
            st.session_state.current_token = {
                "number": next_token["number"],
                "name": next_token["name"],
                "category": next_token["category"],
                "service": "Income Certificate",
                "time": "Just Now"
            }
            st.toast(f"Called Token {next_token['number']}!")
            st.rerun()
        else:
            st.warning("No citizens waiting in the queue!")

# --- RIGHT COLUMN: SERVICE-SPECIFIC QUEUE VIEW ---
with right_col:
    st.markdown("### 📋 Service Queue")
    st.caption("Service Filter: Income / Domicile Certificate")
    
    if st.session_state.queue:
        for idx, item in enumerate(st.session_state.queue):
            with st.container(border=True):
                st.markdown(f"**{item['number']}** — {item['name']}")
                st.caption(f"Priority: {item['category']} | Est. Wait: {item['wait']}")
    else:
        st.success("Queue is empty!")
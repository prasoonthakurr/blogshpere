# 🌐 BlogSphere

BlogSphere is a sector-based, role-controlled blogging platform built using:

- **Node.js**
- **Express.js**
- **EJS**
- **PostgreSQL**
- **Sequelize ORM**
- **Multer** for image uploads

It features a hierarchical access system with SuperAdmins, Admins, and Users, along with a full blog approval workflow based on sectors.

---

## 🚀 Live Demo

**Hosted Website:** https://blogshpere-ts5d.onrender.com/

### 🔐 Demo SuperAdmin Credentials

Email: **superadmin@gmail.com**  
Password: **admin123**

> **Note:** These credentials are for demo use only.

---

# 🏛️ Role Hierarchy

## 👑 SuperAdmin
The highest-level role with full access.

### SuperAdmin Capabilities
- Create **Admins**
- Create **Users**
- Create **Sectors**
- Assign multiple sectors to Admins
- Approve or reject **public** blogs
- Delete any approved blog
- Upload images for:
  - Their profile  
  - Users  
  - Blogs during creation/edit
- Full access to all sectors and all blogs

---

## 🛡️ Admin
Admins operate within specific sectors assigned by the SuperAdmin.

### Admin Capabilities
- Create **Users**
- Create blogs **only in their assigned sectors**
- Approve or reject blogs belonging to their sectors
- Handle approval for **public blogs** belonging to their sectors
- Delete approved blogs in their sectors
- Upload images for:
  - Profile  
  - Users they create  
  - Blogs they create/edit  

---

## 👤 User
Basic role for creating blogs.

### User Capabilities
- Create **Public or Private** blogs
- Select a sector while posting a blog
- Upload an image for each blog via Multer
- Track their blog approval status

---

# 📝 Blog Workflow

## 1. Blog Creation
Users, Admins, and SuperAdmins can create blogs with:
- Title  
- Description  
- Sector  
- Image (via Multer)  
- Public/Private visibility  

The blog then enters the **Pending** state.

---

## 2. Admin Approval (Sector-Based)
Admins can:
- Approve  
- Reject  
- Delete approved blogs  

Admin actions apply **only to blogs within their assigned sectors**.

### For Public Blogs:
Admin or SuperAdmin must:
- Approve → Blog becomes **public**
- Reject → Blog is discarded
- Delete → Remove any approved blog

Private blogs skip this step.

---

# 📌 Visibility Rules

| Blog Type      | Visible To |
|----------------|------------|
| **Public And Approved**     | Everyone (homepage) |
| **Private**    | Owner |

---

# 📸 Image Upload (Multer)

Multer is used for all image uploads:
- Blog feature images  
- User profile images  
- Updated blog images  

Uploaded files are stored in:

- `/public/uploads/`


Images are rendered dynamically through EJS views.

---

# 🗂️ Project Structure

- `/controllers` → Core logic  
- `/models` → Sequelize models  
- `/routes` → Route handlers  
- `/views` → EJS templates  
- `/uploads` → Uploaded images (Multer)

---

# 🧩 Sequelize Models Overview

### **User**
- id, name, email, password
- role  
- sectorIds (nullable for SuperAdmin)
- profileImage

### **Blog**
- id, title, content
- sectorId  
- image  
- createdBy  
- visibility: public/private  
- Approval

### **Sector**
- id  
- name

### **Role**
- SuperAdmin / Admin / User

---

# 🛠️ Tech Stack

### Backend:
- Node.js  
- Express.js  
- PostgreSQL  
- Sequelize ORM

### Frontend:
- EJS  
- Bootstrap  

### Additional Libraries:
- Multer (file uploads)  
- bcrypt (password hashing)  
- express-session (authentication)

---

# ▶️ Run Project Locally

## 1. Clone Repo
```bash
git clone https://github.com/your-repo/blogsphere.git
cd blogsphere
```
## 2. Install Dependencies
```bash
npm install
```
## 3. Configure .env
```bash
JWT_SECRET=
DATABASE_URL=
```
## 5. Start Server
```bash
npm start
```
## 🎯 Demo Walkthrough Suggestions

### As SuperAdmin:
- Create sectors  
- Create Admin and assign sectors  
- Create Users  
- Approve public blogs  
- Upload images  

### As Admin:
- Approve blogs in your sector  
- Create users  
- Create blogs for your sectors  

### As User:
- Create public/private blog  
- Upload image  
- Track approval status  

---

## 🤝 Contributing
Pull requests are welcome!  
For major changes, please open an issue to discuss your ideas before implementation.

import { Edit, Trash2, Plus, Eye, X, Save, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  [key: string]: any; // For any additional fields from API
}

export function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'administrators' | 'operators' | 'active'>('all');
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<UserData>>({});
  const [saving, setSaving] = useState(false);

  // Add User modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState<any>({
    user_name: '',
    email: '',
    role: 'operator',
    status: 'active',
    last_login: ''
  });
  const [adding, setAdding] = useState(false);

  // Delete confirmation modal state
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3Ny1NUVdFRTNHZE5adGlsWU5IYmpsa2dVSkpaWUJWVmN1UmFZdHl5ejFjIn0.eyJleHAiOjE3MjYxODIzMzEsImlhdCI6MTcyNjE0NjMzMSwianRpIjoiOGVlZTU1MDctNGVlOC00NjE1LTg3OWUtNTVkMjViMjQ2MGFmIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrLmtleWNsb2FrLnN2Yy5jbHVzdGVyLmxvY2FsOjgwODAvcmVhbG1zL21hc3RlciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJmNzFmMzU5My1hNjdhLTQwYmMtYTExYS05YTQ0NjY4YjQxMGQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJIT0xBQ1JBQ1kiLCJzZXNzaW9uX3N0YXRlIjoiYmI1ZjJkMzktYTQ3ZC00MjI0LWFjZGMtZTdmNzQwNDc2OTgwIiwibmFtZSI6ImtzYW14cCBrc2FteHAiLCJnaXZlbl9uYW1lIjoia3NhbXhwIiwiZmFtaWx5X25hbWUiOiJrc2FteHAiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwYXNzd29yZF90ZW5hbnRfa3NhbXhwQG1vYml1c2R0YWFzLmFpIiwiZW1haWwiOiJwYXNzd29yZF90ZW5hbnRfa3NhbXhwQG1vYml1c2R0YWFzLmFpIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtbWFzdGVyIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7IkhPTEFDUkFDWSI6eyJyb2xlcyI6WyJIT0xBQ1JBQ1lfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwic2lkIjoiYmI1ZjJkMzktYTQ3ZC00MjI0LWFjZGMtZTdmNzQwNDc2OTgwIiwidGVuYW50SWQiOiJmNzFmMzU5My1hNjdhLTQwYmMtYTExYS05YTQ0NjY4YjQxMGQiLCJyZXF1ZXN0ZXJUeXBlIjoiVEVOQU5UIn0=.FXeDyHBhlG9L4_NCeSyHEaNEBVmhFpfSBqlcbhHaPaoydhKcA0BfuyHgxg_32kQk6z5S9IQ7nVKS2ybtOvwo0WyLWwLQchSq7Noa7LooHIMzmeWMQb_bLKtbaOti59zwIdS8CkfGaXut7RUQKISQVWmbUGsVJQa2JkG6Ng_QN0y5hFVksMWPZiXVsofQkJXHXV1CQ3gabhhHKo3BqlJwzpsCKLDfg1-4PmSl1Wqbw03Ef2yolroj5i8FoeHukOQPkwCUHrrNw-ilIp917nqZa89YbCMtDjWyaj8pEH7GJR5vMZPE2WcJPn5dSA1IHVunfatEB1cDAitaFjVNWNnddQ";
  
  const updateToken = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3Ny1NUVdFRTNHZE5adGlsWU5IYmpsa2dVSkpaWUJWVmN1UmFZdHl5ejFjIn0.eyJleHAiOjE3NTk1MjM5OTYsImlhdCI6MTc1OTQ4Nzk5NiwianRpIjoiMTFiNGIyZTAtMGI5YS00YWJiLTljOTgtMWI1OTY0MDdhZGIzIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrLXNlcnZpY2Uua2V5Y2xvYWsuc3ZjLmNsdXN0ZXIubG9jYWw6ODA4MC9yZWFsbXMvbWFzdGVyIiwiYXVkIjpbIkhPTEFDUkFDWV9tb2JpdXMiLCJhY2NvdW50Il0sInN1YiI6ImY3MWYzNTkzLWE2N2EtNDBiYy1hMTFhLTlhNDQ2NjhiNDEwZCIsInR5cCI6IkJlYXJlciIsImF6cCI6IkJPTFRaTUFOTl9CT1RfbW9iaXVzIiwic2lkIjoiM2Q5NmNlNTUtMWI1Yi00MzU3LThlZjItZDA3YjJhYzM2MjZmIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLW1hc3RlciIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJIT0xBQ1JBQ1lfbW9iaXVzIjp7InJvbGVzIjpbIkhPTEFDUkFDWV9VU0VSIl19LCJCT0xUWk1BTk5fQk9UX21vYml1cyI6eyJyb2xlcyI6WyJCT0xUWk1BTk5fQk9UX1VTRVIiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInJlcXVlc3RlclR5cGUiOiJURU5BTlQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6ImtzYW14cCBrc2FteHAiLCJ0ZW5hbnRJZCI6ImY3MWYzNTkzLWE2N2EtNDBiYy1hMTFhLTlhNDQ2NjhiNDEwZCIsInBsYXRmb3JtSWQiOiJtb2JpdXMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwYXNzd29yZF90ZW5hbnRfa3NhbXhwQG1vYml1c2R0YWFzLmFpIiwiZ2l2ZW5fbmFtZSI6ImtzYW14cCIsImZhbWlseV9uYW1lIjoia3NhbXhwIiwiZW1haWwiOiJwYXNzd29yZF90ZW5hbnRfa3NhbXhwQG1vYml1c2R0YWFzLmFpIn0.Wg5mM_tU9R7y3iBqztxkDcA_n_sM-AAcQj_YqqUwMufdVRZraCIpflOmpdRlf88ZGKfXRmt43O66fqu2z9-fw33z3EKrt-CCDFY1b0PAJGjTLGQfdz4YGyaezA177reqtac9HGs5cCxpzjDkKcVHmm-PSo_RR8Nsp7yqUzdrSZ4okTRYMNAsa4nWdww1UnkG8cKYn3UgnjXzHNo8vLsx4n9XlFQr-iBn5CWf_pWm4cPvowW4jcMosT-yVE0M5ayCLLrAsMKOeJJc7kwT-XPYK_3jwdh5MF0M3yCn2-U_PBFeH7kDQIdbwHSfDf5eatpSBXLYUGkGqR0ehOChG7pK8Q";

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          'https://ig.gov-cloud.ai/pi-entity-instances-service/v2.0/schemas/694a39da7387204b7154ecfd/instances/list?size=1000',
          {
            method: 'POST',
            headers: {
              'accept': 'application/json, text/plain, */*',
              'authorization': `Bearer ${token}`,
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              dbType: 'TIDB'
            })
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Map API response to our UserData format
        // API returns array directly or wrapped in data property
        const usersArray = Array.isArray(data) ? data : (data?.data || []);
        
        const mappedUsers: UserData[] = usersArray.map((item: any) => {
          // Map based on actual API response structure:
          // role, user_name, last_login, id, email, status
          return {
            id: item.id || item._id,
            name: item.user_name || item.name || item.userName || item.fullName || 'Unknown User',
            email: item.email || item.emailAddress || item.userEmail || '',
            role: item.role || item.userRole || 'Operator',
            status: item.status || 'inactive',
            lastLogin: item.last_login || item.lastLogin || item.lastLoginTime || '',
            ...item // Include all original fields
          };
        });

        setUsers(mappedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const getRoleColor = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower === 'administrator' || roleLower.includes('admin')) return 'bg-red-100 border border-red-200';
    if (roleLower === 'supervisor' || roleLower.includes('supervisor')) return 'bg-indigo-100 border border-indigo-200';
    if (roleLower === 'operator' || roleLower.includes('operator')) return 'bg-blue-100 border border-blue-200';
    if (roleLower.includes('analyst')) return 'bg-green-100 border border-green-200';
    if (roleLower.includes('technical') || roleLower.includes('tech')) return 'bg-yellow-100 border border-yellow-200';
    return 'bg-gray-100 border border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    return statusLower === 'active' || statusLower === 'online'
      ? 'bg-green-100 border border-green-200'
      : 'bg-red-100 border border-red-200';
  };

  // Filter users based on selected filter
  const filteredUsers = useMemo(() => {
    if (selectedFilter === 'all') {
      return users;
    }
    if (selectedFilter === 'active') {
      return users.filter(user => {
        const status = user.status?.toLowerCase() || '';
        return status === 'active' || status === 'online';
      });
    }
    if (selectedFilter === 'administrators') {
      return users.filter(user => {
        const role = user.role?.toLowerCase() || '';
        return role.includes('admin') || role.includes('administrator');
      });
    }
    if (selectedFilter === 'operators') {
      return users.filter(user => {
        const role = user.role?.toLowerCase() || '';
        return role.includes('operator') || role.includes('officer');
      });
    }
    return users;
  }, [users, selectedFilter]);

  // Handle edit button click
  const handleEditClick = (user: UserData) => {
    setEditingUser(user);
    // Initialize form with current user data using exact API attribute names
    const originalData = user as any;
    setEditFormData({
      id: user.id,
      user_name: originalData.user_name || user.name.replace(/ /g, '_').toLowerCase(),
      email: user.email,
      role: user.role,
      status: user.status,
      last_login: originalData.last_login || user.lastLogin || ''
    });
  };

  // Handle save button click
  const handleSave = async () => {
    if (!editingUser) return;

    setSaving(true);
    try {
      // Prepare the update payload with exact API attribute names
      // API attributeList: role, user_name, last_login, id, email, status
      const updateData: any = {};
      
      // Only include the exact attribute names that the API expects
      if (editFormData.id) updateData.id = editFormData.id;
      if (editFormData.user_name !== undefined) updateData.user_name = editFormData.user_name;
      if (editFormData.email !== undefined) updateData.email = editFormData.email;
      if (editFormData.role !== undefined) updateData.role = editFormData.role;
      if (editFormData.status !== undefined) updateData.status = editFormData.status;
      if (editFormData.last_login !== undefined) updateData.last_login = editFormData.last_login;

      const updatePayload = {
        primarykeyEnable: true,
        bulkUpdate: [updateData]
      };

      const response = await fetch(
        'https://ig.gov-cloud.ai/pi-entity-instances-service/v2.0/schemas/694a39da7387204b7154ecfd/instances',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${updateToken}`,
          },
          body: JSON.stringify(updatePayload)
        }
      );

      if (!response.ok) {
        throw new Error(`Update failed: ${response.status} ${response.statusText}`);
      }

      // Update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === editingUser.id) {
            return {
              ...user,
              name: editFormData.user_name?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || user.name,
              email: editFormData.email || user.email,
              role: editFormData.role || user.role,
              status: editFormData.status || user.status,
              lastLogin: editFormData.last_login || user.lastLogin,
              ...editFormData
            };
          }
          return user;
        })
      );

      // Close the edit modal
      setEditingUser(null);
      setEditFormData({});
    } catch (err) {
      console.error('Error updating user:', err);
      alert(`Failed to update user: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    setEditingUser(null);
    setEditFormData({});
  };

  // Generate UUID function
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Handle Add User button click
  const handleAddClick = () => {
    setIsAddModalOpen(true);
    setAddFormData({
      user_name: '',
      email: '',
      role: 'operator',
      status: 'active',
      last_login: ''
    });
  };

  // Handle cancel Add User
  const handleAddCancel = () => {
    setIsAddModalOpen(false);
    setAddFormData({
      user_name: '',
      email: '',
      role: 'operator',
      status: 'active',
      last_login: ''
    });
  };

  // Handle delete button click
  const handleDeleteClick = (user: UserData) => {
    setUserToDelete(user);
  };

  // Handle cancel delete
  const handleDeleteCancel = () => {
    setUserToDelete(null);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      // Prepare delete payload with filter
      const deletePayload = {
        filter: {
          id: userToDelete.id
        }
      };

      const response = await fetch(
        'https://ig.gov-cloud.ai/pi-entity-instances-service/v2.0/schemas/694a39da7387204b7154ecfd/instances',
        {
          method: 'DELETE',
          headers: {
            'accept': 'application/json, text/plain, */*',
            'authorization': `Bearer ${token}`,
            'content-type': 'application/json'
          },
          body: JSON.stringify(deletePayload)
        }
      );

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
      }

      // Remove user from local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
      
      // Close delete modal
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(`Failed to delete user: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDeleting(false);
    }
  };

  // Handle save (ingest) new user
  const handleAddSave = async () => {
    setAdding(true);
    try {
      // Generate random UUID for the new user
      const newUserId = generateUUID();
      
      // Build payload with exact API attribute names
      const newUserPayload: any = {
        id: newUserId
      };
      if (addFormData.user_name) newUserPayload.user_name = addFormData.user_name;
      if (addFormData.email) newUserPayload.email = addFormData.email;
      if (addFormData.role) newUserPayload.role = addFormData.role;
      if (addFormData.status) newUserPayload.status = addFormData.status;
      if (addFormData.last_login) newUserPayload.last_login = addFormData.last_login;

      const response = await fetch(
        'https://ig.gov-cloud.ai/pi-entity-instances-service/v2.0/schemas/694a39da7387204b7154ecfd/instances',
        {
          method: 'POST',
          headers: {
            'accept': 'application/json, text/plain, */*',
            'authorization': `Bearer ${token}`,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            data: [newUserPayload]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Create failed: ${response.status} ${response.statusText}`);
      }

      // Map API response to our UserData format and add to list
      const displayName = (addFormData.user_name || '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase());

      const newUser: UserData = {
        id: newUserId,
        name: displayName || 'New User',
        email: addFormData.email || '',
        role: addFormData.role || 'operator',
        status: addFormData.status || 'active',
        lastLogin: addFormData.last_login || '',
        user_name: addFormData.user_name,
        last_login: addFormData.last_login
      };

      setUsers(prev => [...prev, newUser]);
      handleAddCancel();

      // Refresh the list to get the latest data
      // Optionally, you can refetch users here if the API returns the created user
    } catch (err) {
      console.error('Error creating user:', err);
      alert(`Failed to create user: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setAdding(false);
    }
  };


  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-black">Error loading users: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
              selectedFilter === 'all' 
                ? 'bg-white border-gray-300 text-black shadow-sm' 
                : 'bg-transparent border-transparent text-black/60 hover:bg-white hover:shadow-sm'
            }`}
          >
            All Users
          </button>
          <button 
            onClick={() => setSelectedFilter('administrators')}
            className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
              selectedFilter === 'administrators' 
                ? 'bg-white border-gray-300 text-black shadow-sm' 
                : 'bg-transparent border-transparent text-black/60 hover:bg-white hover:shadow-sm'
            }`}
          >
            Administrators
          </button>
          <button 
            onClick={() => setSelectedFilter('operators')}
            className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
              selectedFilter === 'operators' 
                ? 'bg-white border-gray-300 text-black shadow-sm' 
                : 'bg-transparent border-transparent text-black/60 hover:bg-white hover:shadow-sm'
            }`}
          >
            Operators
          </button>
          <button 
            onClick={() => setSelectedFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
              selectedFilter === 'active' 
                ? 'bg-white border-gray-300 text-black shadow-sm' 
                : 'bg-transparent border-transparent text-black/60 hover:bg-white hover:shadow-sm'
            }`}
          >
            Active Only
          </button>
        </div>
        <button 
          onClick={handleAddClick}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-card border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-4 text-xs text-black/60 uppercase">User</th>
              <th className="text-left p-4 text-xs text-black/60 uppercase">Email</th>
              <th className="text-center p-4 text-xs text-black/60 uppercase">Role</th>
              <th className="text-center p-4 text-xs text-black/60 uppercase">Status</th>
              <th className="text-center p-4 text-xs text-black/60 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-black/50">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name
                          .split(/[\s_-]/)
                          .map(n => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-black">
                        {user.name.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-black/70">{user.email}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs text-black ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs uppercase text-black ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="p-2 text-black hover:bg-gray-100 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-black/60 hover:bg-gray-100 rounded transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(user)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={handleAddCancel}>
          <div 
            className="bg-white border border-gray-200 rounded-lg w-full max-w-md mx-4 transform transition-all shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-black">Add User</h3>
              <button 
                onClick={handleAddCancel}
                className="p-1 text-black/50 hover:text-black rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* User Name */}
              <div>
                <label className="block text-sm text-black/60 mb-2">User Name</label>
                <input
                  type="text"
                  value={addFormData.user_name}
                  onChange={(e) => setAddFormData({ ...addFormData, user_name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="e.g., admin_vishwas"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-black/60 mb-2">Email</label>
                <input
                  type="email"
                  value={addFormData.email}
                  onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="user@company.com"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm text-black/60 mb-2">Role</label>
                <select
                  value={addFormData.role}
                  onChange={(e) => setAddFormData({ ...addFormData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:border-gray-400 transition-colors"
                >
                  <option value="administrator">Administrator</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="operator">Operator</option>
                  <option value="analyst">Analyst</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-black/60 mb-2">Status</label>
                <select
                  value={addFormData.status}
                  onChange={(e) => setAddFormData({ ...addFormData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:border-gray-400 transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={handleAddCancel}
                disabled={adding}
                className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSave}
                disabled={adding}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
              >
                {adding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Add
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={handleCancel}>
          <div 
            className="bg-white border border-gray-200 rounded-lg w-full max-w-md mx-4 transform transition-all shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-black">Edit User</h3>
              <button 
                onClick={handleCancel}
                className="p-1 text-black/50 hover:text-black rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* User Name */}
              <div>
                <label className="block text-sm text-black/60 mb-2">User Name</label>
                <input
                  type="text"
                  value={editFormData.user_name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, user_name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="user_name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-black/60 mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="email@example.com"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm text-black/60 mb-2">Role</label>
                <select
                  value={editFormData.role || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:border-gray-400 transition-colors"
                >
                  <option value="administrator">Administrator</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="operator">Operator</option>
                  <option value="analyst">Analyst</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-black/60 mb-2">Status</label>
                <select
                  value={editFormData.status || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:border-gray-400 transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={handleDeleteCancel}>
          <div 
            className="bg-white border border-red-200 rounded-lg w-full max-w-md mx-4 transform transition-all shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-black">Delete User</h3>
                <p className="text-sm text-black/60">This action cannot be undone</p>
              </div>
              <button 
                onClick={handleDeleteCancel}
                className="p-1 text-black/50 hover:text-black rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-sm text-black mb-2">
                Are you sure you want to delete this user?
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <p className="font-medium text-black">{userToDelete.name}</p>
                <p className="text-sm text-black/70 mt-1">{userToDelete.email}</p>
                <p className="text-xs text-black/60 mt-2">Role: {userToDelete.role}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

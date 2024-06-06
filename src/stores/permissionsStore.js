import { makeAutoObservable } from 'mobx';
import isEmpty from 'is-empty';
import applicationStore from './applicationStore';

import {
  all,
  permission,
  add,
  deletePerm,
  update,
} from '../services/permissionService';

class PermissionsStore {
  allPermissions = undefined;
  permissions = [];
  currentPermission = {
    resource: '',
    action: '',
    description: '',
    isAdvanced: false,
  };

  loading = false;
  errors = {};
  isEditing = false;

  constructor() {
    makeAutoObservable(this);
  }

  resetPermissionFields() {
    this.currentPermission = {
      resource: '',
      action: '',
      description: '',
      isAdvanced: false,
    };
    this.errors = {};
  }

  setIsEditing() {
    this.isEditing = !this.isEditing;
  }

  inputChange(name, value) {
    this.currentPermission[name] = value;
    this.errors[name] && delete this.errors[name];
  }

  setIsAdvanced() {
    this.currentPermission.isAdvanced = !this.currentPermission.isAdvanced;
  }

  async validatePermission() {
    const errors = {};

    if (isEmpty(this.currentPermission.resource)) errors.resource = 'Required';
    if (isEmpty(this.currentPermission.action)) errors.action = 'Required';
    if (isEmpty(this.currentPermission.description))
      errors.description = 'Required';

    if (isEmpty(errors)) {
      return 'ok';
    } else {
      this.errors = { ...errors };
      return { errors: errors };
    }
  }

  async addNewPermission() {
    if (applicationStore.permissions.permission?.create) {
      this.loading = true;
      const result = await this.validatePermission();
      if (result === 'ok') {
        try {
          const role = { ...this.currentPermission };
          await add(role);
          this.resetPermissionFields();
          return 'ok';
        } finally {
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    }
  }

  async updatePermission() {
    if (applicationStore.permissions.permission?.modify) {
      this.loading = true;
      const result = await this.validatePermission();
      if (result === 'ok') {
        try {
          const role = this.currentPermission;
          await update(this.currentPermission.id, role);
          this.resetPermissionFields();
          return 'ok';
        } finally {
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    }
  }

  async getAllPermissions() {
    if (applicationStore.permissions.permission?.view) {
      try {
        this.loading = true;
        const permissions = await all();
        this.allPermissions = permissions;
        this.permissions = permissions;
      } finally {
        this.loading = false;
      }
    }
  }

  async getPermission(id) {
    if (applicationStore.permissions.permission?.modify) {
      this.loading = true;
      try {
        const response = await permission(id);
        this.currentPermission = response;
        return 'ok';
      } finally {
        this.loading = false;
      }
    }
  }

  async deletePermission(id) {
    if (applicationStore.permissions.permission?.delete) {
      this.loading = true;
      try {
        await deletePerm(id);
        await this.getAllPermissions();
      } finally {
        this.loading = false;
      }
    }
  }

  get permissionsOptions() {
    if (applicationStore.permissions.permission?.view) {
      if (!this.allPermissions) return false;

      const mapPerms = this.allPermissions.map((perm) => ({
        label: `${perm.resource}/${perm.action}`,
        value: +perm.id,
        ...perm,
      }));

      const sortPerms = mapPerms.sort((a, b) => {
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        return 0;
      });

      return sortPerms;
    }
    return null;
  }

  get permissionData() {
    return this.permissions;
  }
}

export default new PermissionsStore();

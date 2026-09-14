// Mock data fixtures for Control Plane — Environment Inventory & Details
// Covers every UI state called out in the spec: stale vs verified freshness,
// in-sync vs drifted config, stable vs non-release/beta builds, purged status,
// unassigned delivery lead, and a non-applicable resource-details case.

export type DeploymentModel = 'Prevalent Hosted' | 'Hybrid Hosted' | 'Client Hosted';
export type EnvironmentStatus = 'Active' | 'Provisioning' | 'Suspended' | 'Purged';
export type CloudProvider = 'AWS' | 'Azure';
export type Freshness = 'Verified' | 'Stale';
export type BuildType = 'Stable' | 'Non-release' | 'Beta';
export type DriftStatus = 'In sync' | 'Drifted' | 'Unknown';
export type DeploymentRunStatus = 'Success' | 'Failed' | 'Rolled back';

export interface EnvironmentSummary {
  id: string;
  customerName: string;
  environmentId: string;
  deploymentModel: DeploymentModel;
  createdDate: string; // ISO date
  status: EnvironmentStatus;
  cloudProvider: CloudProvider;
  region: string;
  softwareVersion: string;
  freshness: Freshness;
  lastSync: string; // ISO datetime
}

export interface EnvironmentDetails extends EnvironmentSummary {
  assignedDeliveryLead: string | null;
  topology: {
    cloudAccountRef: string;
    kubernetesClusterId: string;
    platformComponents: string[];
  };
  softwareVersionDetails: {
    buildType: BuildType;
    lastVersionChangeDate: string | null; // null renders "Not yet available"
  };
  configSnapshot: {
    driftStatus: DriftStatus;
    configValues: Record<string, string | number | boolean>;
    featureFlags: { name: string; enabled: boolean }[];
  };
  resourceDetails: {
    applicable: boolean;
    vmCount?: number;
    storageVolumeCount?: number;
    otherResources?: { label: string; count: number }[];
  };
  usageCost: {
    monthlyCostUsd: number;
    costTrendPct: number; // vs. last month — negative is a decrease
    apiCallsLast30d: number;
    storageUsedGb: number;
  };
  deploymentHistory: {
    version: string;
    date: string; // ISO date
    deployedBy: string;
    status: DeploymentRunStatus;
  }[];
  access: {
    name: string;
    role: string;
    lastAccessed: string | null; // ISO datetime, null if never
  }[];
  auditLog: {
    timestamp: string; // ISO datetime
    actor: string;
    action: string;
  }[];
}

export const mockEnvironments: EnvironmentDetails[] = [
  {
    id: 'env-acme-prod',
    customerName: 'Acme Corp',
    environmentId: 'acme-prod',
    deploymentModel: 'Prevalent Hosted',
    createdDate: '2025-03-14',
    status: 'Active',
    cloudProvider: 'AWS',
    region: 'us-east-1',
    softwareVersion: '2.4.1',
    freshness: 'Verified',
    lastSync: '2026-09-10T14:57:00Z',
    assignedDeliveryLead: 'Priya Nair',
    topology: {
      cloudAccountRef: 'aws-acct-8841-prod',
      kubernetesClusterId: 'eks-acme-prod-01',
      platformComponents: ['Exposure Management', 'Risk Register', 'Navigator'],
    },
    softwareVersionDetails: {
      buildType: 'Stable',
      lastVersionChangeDate: '2026-08-02',
    },
    configSnapshot: {
      driftStatus: 'In sync',
      configValues: {
        maxConcurrentScans: 20,
        dataRetentionDays: 90,
        ssoEnabled: true,
      },
      featureFlags: [
        { name: 'graph-filter-v2', enabled: true },
        { name: 'compliance-module', enabled: true },
        { name: 'beta-dashboards', enabled: false },
      ],
    },
    resourceDetails: {
      applicable: true,
      vmCount: 14,
      storageVolumeCount: 6,
    },
    usageCost: {
      monthlyCostUsd: 4280,
      costTrendPct: 6,
      apiCallsLast30d: 182400,
      storageUsedGb: 512,
    },
    deploymentHistory: [
      { version: '2.4.1', date: '2026-08-02', deployedBy: 'Priya Nair', status: 'Success' },
      { version: '2.4.0', date: '2026-06-14', deployedBy: 'Priya Nair', status: 'Success' },
      { version: '2.3.9', date: '2026-04-02', deployedBy: 'CI/CD Pipeline', status: 'Success' },
    ],
    access: [
      { name: 'Priya Nair', role: 'Delivery Lead', lastAccessed: '2026-09-10T14:40:00Z' },
      { name: 'Jordan Blake', role: 'SRE', lastAccessed: '2026-09-09T11:05:00Z' },
      { name: 'svc-deploy-bot', role: 'Service Account', lastAccessed: '2026-09-10T02:00:00Z' },
    ],
    auditLog: [
      { timestamp: '2026-09-10T14:57:00Z', actor: 'System', action: 'Freshness check completed — verified' },
      { timestamp: '2026-08-02T09:14:00Z', actor: 'Priya Nair', action: 'Deployed version 2.4.1' },
      { timestamp: '2026-07-28T16:02:00Z', actor: 'Jordan Blake', action: 'Updated dataRetentionDays: 60 → 90' },
    ],
  },
  {
    id: 'env-globex-prod',
    customerName: 'Globex Inc',
    environmentId: 'globex-prod',
    deploymentModel: 'Client Hosted',
    createdDate: '2025-06-02',
    status: 'Active',
    cloudProvider: 'Azure',
    region: 'westeurope',
    softwareVersion: '2.3.6',
    freshness: 'Stale',
    lastSync: '2026-09-10T08:52:00Z',
    assignedDeliveryLead: 'Marwa Idris',
    topology: {
      cloudAccountRef: 'az-sub-globex-eu-2201',
      kubernetesClusterId: 'aks-globex-prod-02',
      platformComponents: ['Exposure Management', 'Asset Deep Dive'],
    },
    softwareVersionDetails: {
      buildType: 'Non-release',
      lastVersionChangeDate: '2026-05-11',
    },
    configSnapshot: {
      driftStatus: 'Drifted',
      configValues: {
        maxConcurrentScans: 10,
        dataRetentionDays: 30,
        ssoEnabled: false,
      },
      featureFlags: [
        { name: 'graph-filter-v2', enabled: false },
        { name: 'compliance-module', enabled: true },
      ],
    },
    resourceDetails: {
      applicable: true,
      vmCount: 8,
      storageVolumeCount: 4,
    },
    usageCost: {
      monthlyCostUsd: 2140,
      costTrendPct: -3,
      apiCallsLast30d: 64200,
      storageUsedGb: 210,
    },
    deploymentHistory: [
      { version: '2.3.6', date: '2026-05-11', deployedBy: 'Marwa Idris', status: 'Success' },
      { version: '2.3.5', date: '2026-02-20', deployedBy: 'Marwa Idris', status: 'Rolled back' },
    ],
    access: [
      { name: 'Marwa Idris', role: 'Delivery Lead', lastAccessed: '2026-09-08T09:00:00Z' },
      { name: 'Globex IT Admin', role: 'Client Owner', lastAccessed: '2026-08-30T13:15:00Z' },
    ],
    auditLog: [
      { timestamp: '2026-09-10T08:52:00Z', actor: 'System', action: 'Freshness check failed — last verification did not succeed' },
      { timestamp: '2026-05-11T10:30:00Z', actor: 'Marwa Idris', action: 'Deployed version 2.3.6' },
      { timestamp: '2026-05-02T08:00:00Z', actor: 'System', action: 'Configuration drift detected' },
    ],
  },
  {
    id: 'env-initech-prod',
    customerName: 'Initech',
    environmentId: 'initech-prod',
    deploymentModel: 'Hybrid Hosted',
    createdDate: '2025-01-20',
    status: 'Active',
    cloudProvider: 'AWS',
    region: 'us-west-2',
    softwareVersion: '2.4.1',
    freshness: 'Verified',
    lastSync: '2026-09-10T14:48:00Z',
    assignedDeliveryLead: null,
    topology: {
      cloudAccountRef: 'aws-acct-3390-hybrid',
      kubernetesClusterId: 'eks-initech-prod-01',
      platformComponents: ['Exposure Management', 'Risk Register'],
    },
    softwareVersionDetails: {
      buildType: 'Stable',
      lastVersionChangeDate: '2026-07-28',
    },
    configSnapshot: {
      driftStatus: 'In sync',
      configValues: {
        maxConcurrentScans: 15,
        dataRetentionDays: 60,
        ssoEnabled: true,
      },
      featureFlags: [
        { name: 'graph-filter-v2', enabled: true },
        { name: 'beta-dashboards', enabled: true },
      ],
    },
    resourceDetails: {
      applicable: true,
      vmCount: 11,
      storageVolumeCount: 5,
    },
    usageCost: {
      monthlyCostUsd: 3120,
      costTrendPct: 2,
      apiCallsLast30d: 121800,
      storageUsedGb: 340,
    },
    deploymentHistory: [
      { version: '2.4.1', date: '2026-07-28', deployedBy: 'CI/CD Pipeline', status: 'Success' },
      { version: '2.4.0', date: '2026-05-30', deployedBy: 'CI/CD Pipeline', status: 'Success' },
    ],
    access: [
      { name: 'Unassigned', role: 'Delivery Lead', lastAccessed: null },
      { name: 'Sam Okafor', role: 'SRE', lastAccessed: '2026-09-09T17:22:00Z' },
    ],
    auditLog: [
      { timestamp: '2026-09-10T14:48:00Z', actor: 'System', action: 'Freshness check completed — verified' },
      { timestamp: '2026-07-28T12:00:00Z', actor: 'CI/CD Pipeline', action: 'Deployed version 2.4.1' },
    ],
  },
  {
    id: 'env-umbrella-prod',
    customerName: 'Umbrella Group',
    environmentId: 'umbrella-prod',
    deploymentModel: 'Prevalent Hosted',
    createdDate: '2024-11-08',
    status: 'Suspended',
    cloudProvider: 'AWS',
    region: 'us-east-1',
    softwareVersion: '2.2.9',
    freshness: 'Stale',
    lastSync: '2026-08-22T10:00:00Z',
    assignedDeliveryLead: 'Tom Reyes',
    topology: {
      cloudAccountRef: 'aws-acct-1187-prod',
      kubernetesClusterId: 'eks-umbrella-prod-01',
      platformComponents: ['Exposure Management'],
    },
    softwareVersionDetails: {
      buildType: 'Beta',
      lastVersionChangeDate: null,
    },
    configSnapshot: {
      driftStatus: 'Drifted',
      configValues: {
        maxConcurrentScans: 5,
        dataRetentionDays: 30,
        ssoEnabled: false,
      },
      featureFlags: [{ name: 'compliance-module', enabled: false }],
    },
    resourceDetails: {
      applicable: true,
      vmCount: 6,
      storageVolumeCount: 3,
    },
    usageCost: {
      monthlyCostUsd: 1860,
      costTrendPct: -18,
      apiCallsLast30d: 4100,
      storageUsedGb: 180,
    },
    deploymentHistory: [
      { version: '2.2.9', date: '2026-08-01', deployedBy: 'Tom Reyes', status: 'Success' },
      { version: '2.2.8-beta', date: '2026-06-19', deployedBy: 'Tom Reyes', status: 'Failed' },
    ],
    access: [{ name: 'Tom Reyes', role: 'Delivery Lead', lastAccessed: '2026-08-22T09:50:00Z' }],
    auditLog: [
      { timestamp: '2026-08-22T10:00:00Z', actor: 'System', action: 'Environment suspended — billing hold' },
      { timestamp: '2026-08-01T14:00:00Z', actor: 'Tom Reyes', action: 'Deployed version 2.2.9' },
    ],
  },
  {
    id: 'env-stark-staging',
    customerName: 'Stark Industries',
    environmentId: 'stark-staging',
    deploymentModel: 'Prevalent Hosted',
    createdDate: '2026-02-11',
    status: 'Provisioning',
    cloudProvider: 'AWS',
    region: 'us-east-1',
    softwareVersion: '2.4.1',
    freshness: 'Verified',
    lastSync: '2026-09-10T14:59:00Z',
    assignedDeliveryLead: 'Priya Nair',
    topology: {
      cloudAccountRef: 'aws-acct-9042-staging',
      kubernetesClusterId: 'eks-stark-staging-01',
      platformComponents: ['Exposure Management'],
    },
    softwareVersionDetails: {
      buildType: 'Stable',
      lastVersionChangeDate: '2026-09-08',
    },
    configSnapshot: {
      driftStatus: 'Unknown',
      configValues: {
        maxConcurrentScans: 5,
        dataRetentionDays: 30,
        ssoEnabled: false,
      },
      featureFlags: [{ name: 'graph-filter-v2', enabled: false }],
    },
    resourceDetails: {
      applicable: true,
      vmCount: 3,
      storageVolumeCount: 1,
    },
    usageCost: {
      monthlyCostUsd: 640,
      costTrendPct: 0,
      apiCallsLast30d: 1250,
      storageUsedGb: 40,
    },
    deploymentHistory: [{ version: '2.4.1', date: '2026-09-08', deployedBy: 'Priya Nair', status: 'Success' }],
    access: [{ name: 'Priya Nair', role: 'Delivery Lead', lastAccessed: '2026-09-10T14:50:00Z' }],
    auditLog: [
      { timestamp: '2026-09-08T09:00:00Z', actor: 'Priya Nair', action: 'Environment provisioned' },
      { timestamp: '2026-09-08T09:05:00Z', actor: 'Priya Nair', action: 'Deployed version 2.4.1' },
    ],
  },
  {
    id: 'env-wayne-prod',
    customerName: 'Wayne Enterprises',
    environmentId: 'wayne-prod',
    deploymentModel: 'Hybrid Hosted',
    createdDate: '2025-05-19',
    status: 'Active',
    cloudProvider: 'Azure',
    region: 'centralindia',
    softwareVersion: '2.4.0',
    freshness: 'Verified',
    lastSync: '2026-09-10T13:05:00Z',
    assignedDeliveryLead: 'Marwa Idris',
    topology: {
      cloudAccountRef: 'az-sub-wayne-in-0091',
      kubernetesClusterId: 'aks-wayne-prod-01',
      platformComponents: ['Exposure Management', 'Navigator', 'Compliance'],
    },
    softwareVersionDetails: {
      buildType: 'Stable',
      lastVersionChangeDate: '2026-06-14',
    },
    configSnapshot: {
      driftStatus: 'In sync',
      configValues: {
        maxConcurrentScans: 18,
        dataRetentionDays: 90,
        ssoEnabled: true,
      },
      featureFlags: [
        { name: 'graph-filter-v2', enabled: true },
        { name: 'compliance-module', enabled: true },
      ],
    },
    resourceDetails: {
      applicable: true,
      vmCount: 12,
      storageVolumeCount: 5,
    },
    usageCost: {
      monthlyCostUsd: 3480,
      costTrendPct: 4,
      apiCallsLast30d: 143900,
      storageUsedGb: 388,
    },
    deploymentHistory: [
      { version: '2.4.0', date: '2026-06-14', deployedBy: 'Marwa Idris', status: 'Success' },
      { version: '2.3.8', date: '2026-03-01', deployedBy: 'Marwa Idris', status: 'Success' },
    ],
    access: [
      { name: 'Marwa Idris', role: 'Delivery Lead', lastAccessed: '2026-09-10T12:40:00Z' },
      { name: 'Lucius Fox', role: 'Client Owner', lastAccessed: '2026-09-05T08:00:00Z' },
    ],
    auditLog: [
      { timestamp: '2026-09-10T13:05:00Z', actor: 'System', action: 'Freshness check completed — verified' },
      { timestamp: '2026-06-14T10:00:00Z', actor: 'Marwa Idris', action: 'Deployed version 2.4.0' },
    ],
  },
  {
    id: 'env-hooli-prod',
    customerName: 'Hooli',
    environmentId: 'hooli-prod',
    deploymentModel: 'Client Hosted',
    createdDate: '2024-09-30',
    status: 'Purged',
    cloudProvider: 'AWS',
    region: 'us-east-1',
    softwareVersion: '2.3.6',
    freshness: 'Stale',
    lastSync: '2026-07-10T09:00:00Z',
    assignedDeliveryLead: null,
    topology: {
      cloudAccountRef: 'aws-acct-5502-client',
      kubernetesClusterId: 'eks-hooli-prod-01',
      platformComponents: ['Exposure Management'],
    },
    softwareVersionDetails: {
      buildType: 'Stable',
      lastVersionChangeDate: '2025-11-02',
    },
    configSnapshot: {
      driftStatus: 'Unknown',
      configValues: {
        maxConcurrentScans: 0,
        dataRetentionDays: 30,
        ssoEnabled: false,
      },
      featureFlags: [],
    },
    resourceDetails: {
      applicable: false, // Client Hosted + Purged: not tracked
    },
    usageCost: {
      monthlyCostUsd: 0,
      costTrendPct: -100,
      apiCallsLast30d: 0,
      storageUsedGb: 0,
    },
    deploymentHistory: [{ version: '2.3.6', date: '2025-11-02', deployedBy: 'CI/CD Pipeline', status: 'Success' }],
    access: [],
    auditLog: [
      { timestamp: '2026-07-10T09:00:00Z', actor: 'System', action: 'Environment purged — data retention window expired' },
      { timestamp: '2025-11-02T09:00:00Z', actor: 'CI/CD Pipeline', action: 'Deployed version 2.3.6' },
    ],
  },
];

// Lightweight projection for the inventory list page (Page 1),
// so the list component doesn't need the full detail payload.
export const mockEnvironmentSummaries: EnvironmentSummary[] = mockEnvironments.map(
  ({ id, customerName, environmentId, deploymentModel, createdDate, status, cloudProvider, region, softwareVersion, freshness, lastSync }) => ({
    id,
    customerName,
    environmentId,
    deploymentModel,
    createdDate,
    status,
    cloudProvider,
    region,
    softwareVersion,
    freshness,
    lastSync,
  }),
);

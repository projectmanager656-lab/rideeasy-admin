import React from 'react'
import {
  Button,
  Input,
  Select,
  Table,
  Search,
  Filter,
  Pagination,
  Modal,
  Badge,
  Card,
  Loader,
  EmptyState,
  ErrorState,
  ConfirmationDialog,
} from './index'

const UIComponentsTest = () => {
  return (
    <div className="space-y-6">
      <Card
        title="UI Components"
        subtitle="Reusable Admin components"
      >
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Delete</Button>

          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="danger">Rejected</Badge>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Name"
          placeholder="Enter name"
        />

        <Select
          label="Status"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
          ]}
        />
      </div>

      <Search placeholder="Search users..." />

      <Filter
        label="Status"
        options={[
          { value: 'active', label: 'Active' },
          { value: 'pending', label: 'Pending' },
        ]}
      />

      <Loader text="Loading components..." />

      <EmptyState
        title="No records"
        message="No records are available."
      />

      <ErrorState
        title="Test error state"
        message="This is a reusable error component."
      />

      <Table
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
        ]}
        data={[
          { _id: 1, name: 'Test User', status: 'Active' },
        ]}
      />

      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={() => {}}
      />

      <Modal
        open={false}
        title="Test Modal"
      >
        Modal content
      </Modal>

      <ConfirmationDialog
        open={false}
        title="Confirm"
        message="Are you sure?"
        onClose={() => {}}
        onConfirm={() => {}}
      />
    </div>
  )
}

export default UIComponentsTest

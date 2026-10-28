import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  FileDrop,
  IconButton,
  InputField,
  SelectField,
  SideNavigation,
  SofiaHeader,
  StatusTag,
  Tabs,
  Toast,
} from "./design-system";

type Location = {
  id: number;
  code: string;
  zone: string;
  storage: "Primary" | "Secondary";
  capacity: number;
  occupancy: string;
  sku: string;
  type: string;
  active: boolean;
};

const initialLocations: Location[] = [
  { id: 1, code: "A01-R04-12-50", zone: "3223", storage: "Primary", capacity: 50, occupancy: "600/800", sku: "NSCFT-M3", type: "Low Volume", active: true },
  { id: 2, code: "A01-R04-12-50", zone: "343", storage: "Secondary", capacity: 50, occupancy: "600/800", sku: "NSCFT-M3", type: "Low Volume", active: true },
  { id: 3, code: "A01-R04-12-50", zone: "122", storage: "Primary", capacity: 50, occupancy: "600/800", sku: "NSCFT-M3", type: "Low Volume", active: true },
  { id: 4, code: "A01-R04-12-50", zone: "987", storage: "Primary", capacity: 50, occupancy: "600/800", sku: "NSCFT-M3", type: "Low Volume", active: true },
];

function LocationTable({
  rows,
  selected,
  onSelectionChange,
  menuRow,
  onMenuChange,
  onDeactivate,
  onEdit,
}: {
  rows: Location[];
  selected: Set<number>;
  onSelectionChange: (next: Set<number>) => void;
  menuRow: number | null;
  onMenuChange: (id: number | null) => void;
  onDeactivate: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  const allSelected = rows.length > 0 && selected.size === rows.length;

  const toggle = (id: number, checked: boolean) => {
    const next = new Set(selected);
    checked ? next.add(id) : next.delete(id);
    onSelectionChange(next);
  };

  return (
    <div className="location-table">
      <div className="location-table__scroller">
        <table>
          <thead>
            <tr>
              <th className="selection-cell">
                <Checkbox
                  label="Select all locations"
                  checked={allSelected}
                  onChange={(checked) => onSelectionChange(checked ? new Set(rows.map((row) => row.id)) : new Set())}
                />
              </th>
              <th>Location Code</th>
              <th>Zone</th>
              <th>Storage Type</th>
              <th>Max Cap</th>
              <th>Occupancy</th>
              <th>SKU</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={selected.has(row.id) ? "is-selected" : ""}>
                <td className="selection-cell">
                  <Checkbox
                    label={`Select ${row.code}`}
                    checked={selected.has(row.id)}
                    onChange={(checked) => toggle(row.id, checked)}
                  />
                </td>
                <td className="location-code">{row.code}</td>
                <td>{row.zone}</td>
                <td><StatusTag tone={row.storage === "Primary" ? "blue" : "green"}>{row.storage}</StatusTag></td>
                <td>{row.capacity}</td>
                <td>{row.occupancy}</td>
                <td>{row.sku}</td>
                <td><StatusTag tone="neutral">{row.type}</StatusTag></td>
                <td><StatusTag tone={row.active ? "green" : "outlined"}>{row.active ? "Active" : "Inactive"}</StatusTag></td>
                <td className="action-cell">
                  <IconButton
                    icon="cb7e1.svg"
                    label={`Actions for ${row.code}`}
                    variant="outlined"
                    onClick={(event) => {
                      event.stopPropagation();
                      onMenuChange(menuRow === row.id ? null : row.id);
                    }}
                  />
                  {menuRow === row.id && (
                    <div className="row-menu" onClick={(event) => event.stopPropagation()}>
                      <Button variant="ghost" size="small" onClick={() => onEdit(row.id)}>Edit</Button>
                      <Button variant="ghost" size="small" onClick={() => onDeactivate(row.id)}>
                        {row.active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr className="empty-row">
                <td colSpan={10}>No locations match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddLocationDialog({
  onClose,
  onSave,
  editing,
}: {
  onClose: () => void;
  onSave: (code: string) => void;
  editing?: Location;
}) {
  const [code, setCode] = useState(editing?.code ?? "");

  return (
    <Dialog title={editing ? "Edit Location" : "Add Location"} onClose={onClose}>
      <div className="add-form">
        <InputField
          label="Location Code *"
          placeholder="eg: A09-R34-10-23"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          autoFocus
        />
        <div className="form-grid">
          <SelectField label="Zone" placeholder="Select" options={["3223", "343", "122", "987"]} />
          <SelectField label="Storage Type" placeholder="Select" options={["Primary", "Secondary"]} />
          <SelectField label="Max Capacity (boxes)" placeholder="Select" options={["25", "50", "100"]} />
          <SelectField label="Tags" placeholder="Select" options={["Low Volume", "High Volume"]} />
        </div>
        <InputField
          label={<><span>Reserved SKU</span><em> (optional)</em></>}
          placeholder="Type here"
        />
        <div className="dialog-actions">
          <Button variant="secondary" size="large" onClick={onClose}>Cancel</Button>
          <Button
            variant={code.trim() ? "primary" : "disabled"}
            size="large"
            disabled={!code.trim()}
            onClick={() => onSave(code.trim())}
          >
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

function ImportDialog({
  onClose,
  onUpload,
}: {
  onClose: () => void;
  onUpload: (fileName: string) => void;
}) {
  const [fileName, setFileName] = useState("");
  const acceptFiles = (files: FileList) => setFileName(files[0]?.name ?? "");

  return (
    <Dialog title="Import Locations - CSV" onClose={onClose}>
      <div className="import-form">
        <p className="import-copy">
          Template columns: location_code, zone_code, storage_type, max_capacity_boxes,
          reserved_sku, status, tags. reserved_sku is optional.
        </p>
        <FileDrop
          fileName={fileName}
          onChange={(event) => event.target.files && acceptFiles(event.target.files)}
          onDrop={acceptFiles}
        />
        <div className="dialog-actions">
          <Button variant="secondary" size="large" onClick={onClose}>Cancel</Button>
          <Button variant={fileName ? "primary" : "disabled"} size="large" disabled={!fileName} onClick={() => onUpload(fileName)}>
            Upload
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default function App() {
  const [locations, setLocations] = useState(initialLocations);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState("Location Management");
  const [query, setQuery] = useState("");
  const [storageFilter, setStorageFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dialog, setDialog] = useState<"add" | "import" | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [menuRow, setMenuRow] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (dialog) {
        setDialog(null);
        setEditingId(null);
      } else {
        setMenuRow(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dialog]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const filteredRows = useMemo(
    () => locations.filter((row) => {
      const matchesSearch = row.code.toLowerCase().includes(query.toLowerCase()) || row.sku.toLowerCase().includes(query.toLowerCase());
      const matchesStorage = !storageFilter || row.storage === storageFilter;
      const matchesStatus = !statusFilter || (statusFilter === "Active") === row.active;
      return matchesSearch && matchesStorage && matchesStatus;
    }),
    [locations, query, storageFilter, statusFilter],
  );

  const updateSelectedStatus = (active: boolean) => {
    setLocations((current) => current.map((row) => selected.has(row.id) ? { ...row, active } : row));
    setToast(`${selected.size} location${selected.size === 1 ? "" : "s"} ${active ? "activated" : "deactivated"}`);
  };

  const saveLocation = (code: string) => {
    if (editingId) {
      setLocations((current) => current.map((row) => row.id === editingId ? { ...row, code } : row));
    } else {
      setLocations((current) => [
        ...current,
        { id: Date.now(), code, zone: "3223", storage: "Primary", capacity: 50, occupancy: "0/800", sku: "—", type: "Low Volume", active: true },
      ]);
    }
    setEditingId(null);
    setDialog(null);
    setToast(editingId ? "Location updated" : "Location added");
  };

  return (
    <div className="app-shell" onClick={() => menuRow !== null && setMenuRow(null)}>
      <SofiaHeader />
      <SideNavigation />
      <main className="workspace">
        <div className="page-heading">
          <img src="/assets/87d62.svg" alt="" />
          <p>Management</p>
        </div>

        <Tabs
          items={["Location Management", "Zone Management", "Pallet Sticker"]}
          active={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "Location Management" ? (
          <>
            <div className="toolbar">
              <div className="toolbar__filters">
                <InputField
                  compact
                  aria-label="Search locations"
                  placeholder="Location code, SKUs"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onClear={() => setQuery("")}
                  trailingIcon="d7440.svg"
                />
                <SelectField
                  aria-label="Filter by storage type"
                  placeholder="Storage Type"
                  value={storageFilter}
                  onChange={(event) => setStorageFilter(event.target.value)}
                  options={["Primary", "Secondary"]}
                />
                <SelectField
                  aria-label="Filter by status"
                  placeholder="Status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  options={["Active", "Inactive"]}
                />
              </div>
              <div className="toolbar__actions">
                <Button variant="secondary" onClick={() => setDialog("import")}>Import CSV</Button>
                <Button leadingIcon="8b8f3.svg" onClick={() => setDialog("add")}>Add Location</Button>
              </div>
            </div>

            {selected.size > 0 && (
              <div className="bulk-actions">
                <p>{selected.size} selected</p>
                <Button variant="secondary" size="small" onClick={() => updateSelectedStatus(true)}>Active all</Button>
                <Button variant="secondary" size="small" onClick={() => updateSelectedStatus(false)}>Inactive all</Button>
                <Button variant="ghost" size="small" className="clear-button" onClick={() => setSelected(new Set())}>
                  Clear <img src="/assets/29646.svg" alt="" />
                </Button>
              </div>
            )}

            <LocationTable
              rows={filteredRows}
              selected={selected}
              onSelectionChange={setSelected}
              menuRow={menuRow}
              onMenuChange={setMenuRow}
              onDeactivate={(id) => {
                const wasActive = locations.find((row) => row.id === id)?.active;
                setLocations((current) => current.map((row) => row.id === id ? { ...row, active: !row.active } : row));
                setMenuRow(null);
                setToast(`Location ${wasActive ? "deactivated" : "activated"}`);
              }}
              onEdit={(id) => {
                setEditingId(id);
                setDialog("add");
                setMenuRow(null);
              }}
            />
          </>
        ) : (
          <div className="empty-state">
            <p>{activeTab}</p>
            <span>This management view is ready for its next flow.</span>
          </div>
        )}
      </main>

      {dialog === "add" && (
        <AddLocationDialog
          onClose={() => { setDialog(null); setEditingId(null); }}
          onSave={saveLocation}
          editing={locations.find((row) => row.id === editingId)}
        />
      )}
      {dialog === "import" && (
        <ImportDialog
          onClose={() => setDialog(null)}
          onUpload={(fileName) => {
            setDialog(null);
            setToast(`${fileName} is ready to import`);
          }}
        />
      )}
      {toast && <Toast message={toast} onDismiss={() => setToast("")} />}
    </div>
  );
}

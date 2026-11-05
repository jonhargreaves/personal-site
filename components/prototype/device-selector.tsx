import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { prototypeDevices, type PrototypeDeviceId } from "./devices";

const items = prototypeDevices.map(({ id, label }) => ({ label, value: id }));

export default function DeviceSelector({
  available,
  selected,
  onSelect,
}: {
  available: readonly PrototypeDeviceId[];
  selected: PrototypeDeviceId;
  onSelect: (device: PrototypeDeviceId) => void;
}) {
  return (
    <Select<PrototypeDeviceId>
      items={items}
      value={selected}
      onValueChange={(value) => {
        if (value !== null) onSelect(value);
      }}
    >
      <SelectTrigger aria-label="Prototype device size" className="w-[180px]">
        <SelectValue className="text-base" />
      </SelectTrigger>
      <SelectContent
        side="bottom"
        align="end"
        sideOffset={8}
        alignItemWithTrigger={false}
        collisionPadding={16}
      >
        <SelectGroup>
          {prototypeDevices.map(({ id, label, width, height }) => {
            const supported = available.includes(id);
            return (
              <SelectItem
                key={id}
                value={id}
                disabled={!supported}
                title={
                  supported
                    ? `View ${label.toLowerCase()} layout (${width} × ${height})`
                    : `A wider window is needed for ${label.toLowerCase()}`
                }
              >
                {label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

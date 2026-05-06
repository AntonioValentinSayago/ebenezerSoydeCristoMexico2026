"use client";

import type { Selection, SortDescriptor } from "@heroui/react";

import { Avatar, Button, Chip, Table, cn, Pagination } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import Header from "./components/Header";

import logoSoydeCristo2026 from "./assets/logo-vertical.jpg";

interface User {
  id: number;
  name: string;
  image_url: string;
  role: string;
  status: "Active" | "Inactive" | "On Leave";
  email: string;
  cursos?: string[]; // Agregamos un nuevo campo para los cursos
  talentos?: string[]; // Agregamos un nuevo campo para los talentos
}

const statusColorMap: Record<string, "success" | "danger" | "warning"> = {
  Active: "success",
  Inactive: "danger",
  "On Leave": "warning",
};

const users: User[] = [
  {
    email: "kate@acme.com",
    id: 4586932,
    image_url:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
    name: "Kate Moore",
    role: "Chief Executive Officer",
    status: "Active",
    cursos: ["Ministerio de Jóvenes", "Ministerio de Alabanza"],
    talentos: ["Liderazgo", "Comunicación"],
  },
  {
    email: "john@acme.com",
    id: 5273849,
    image_url:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
    name: "John Smith",
    role: "Chief Technology Officer",
    status: "Active",
    cursos: ["Ministerio de Niños", "Ministerio de Hospitalidad"],
    talentos: ["Tecnología", "Innovación"],
  },
  {
    email: "sara@acme.com",
    id: 7492836,
    image_url:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
    name: "Sara Johnson",
    role: "Chief Marketing Officer",
    status: "On Leave",
    cursos: ["Ministerio de Mujeres", "Ministerio de Discipulado"],
    talentos: ["Marketing", "Estrategia"],
  },
  {
    email: "michael@acme.com",
    id: 8293746,
    image_url:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
    name: "Michael Brown",
    role: "Chief Financial Officer",
    status: "Active",
    cursos: ["Ministerio de Varones", "Ministerio de Misiones"],
    talentos: ["Finanzas", "Planificación"],
  },
  {
    email: "emily@acme.com",
    id: 1234567,
    image_url:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg",
    name: "Emily Davis",
    role: "Product Manager",
    status: "Inactive",
    cursos: ["Ministerio de Jóvenes", "Ministerio de Alabanza"],
    talentos: ["Gestión de Proyectos", "Comunicación"],
  },
];

function SortableColumnHeader({
  children,
  sortDirection,
}: {
  children: React.ReactNode;
  sortDirection?: "ascending" | "descending";
}) {
  return (
    <span className="flex items-center justify-between">
      {children}
      {!!sortDirection && (
        <Icon
          icon="gravity-ui:chevron-up"
          className={cn(
            "size-3 transform transition-transform duration-100 ease-out",
            sortDirection === "descending" ? "rotate-180" : "",
          )}
        />
      )}
    </span>
  );
}

const ROWS_PER_PAGE = 4;

export function App() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const col = sortDescriptor.column as keyof User;
      const first = String(a[col]);
      const second = String(b[col]);
      let cmp = first.localeCompare(second);

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });
  }, [sortDescriptor]);

  /** Paginacion */
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(users.length / ROWS_PER_PAGE);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return users.slice(start, start + ROWS_PER_PAGE);
  }, [page]);
  const start = (page - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(page * ROWS_PER_PAGE, users.length);

  return (
    <div className="p-6 bg-linear-to-br from-blue-50 to-white min-h-screen">
      <Header
        logo={logoSoydeCristo2026}
        churchName="Iglesia Ebenezer - Prinicipe de Paz"
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Registro de Hermanos 2026"
            className="min-w-200"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
          >
            <Table.Header>
              <Table.Column allowsSorting id="name">
                {({ sortDirection }) => (
                  <SortableColumnHeader sortDirection={sortDirection}>
                    Datos Personales
                  </SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="role">
                {({ sortDirection }) => (
                  <SortableColumnHeader sortDirection={sortDirection}>
                    Ministerios
                  </SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="status">
                {({ sortDirection }) => (
                  <SortableColumnHeader sortDirection={sortDirection}>
                    Cobertura
                  </SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="cursos">
                {({ sortDirection }) => (
                  <SortableColumnHeader sortDirection={sortDirection}>
                    Cursos Completados
                  </SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="talentos">
                {({ sortDirection }) => (
                  <SortableColumnHeader sortDirection={sortDirection}>
                    Talentos
                  </SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column className="text-end">Actions</Table.Column>
            </Table.Header>
            <Table.Body>
              {sortedUsers.map((user) => (
                <Table.Row key={user.id} id={user.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <Avatar.Image src={user.image_url} />
                        <Avatar.Fallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs">{user.name}</span>
                        <span className="text-xs text-muted">{user.email}</span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="min-w-52">
                    {user.cursos?.map((curso) => (
                      <Chip
                        key={curso}
                        color="default"
                        size="sm"
                        variant="soft"
                      >
                        {curso}
                      </Chip>
                    ))}
                  </Table.Cell>
                  <Table.Cell className="min-w-25">
                    <Chip
                      color={statusColorMap[user.status]}
                      size="sm"
                      variant="soft"
                    >
                      {user.status}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell className="min-w-52">
                    {user.role}
                  </Table.Cell>
                  <Table.Cell className="min-w-52">
                    {user.talentos?.map((talento) => (
                      <Chip
                        key={talento}
                        color="default"
                        size="sm"
                        variant="soft"
                      >
                        {talento}
                      </Chip>
                    ))}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1">
                      <Button isIconOnly size="sm" variant="tertiary">
                        <Icon className="size-4" icon="gravity-ui:eye" />
                      </Button>
                      <Button isIconOnly size="sm" variant="tertiary">
                        <Icon className="size-4" icon="gravity-ui:pencil" />
                      </Button>
                      <Button isIconOnly size="sm" variant="danger-soft">
                        <Icon className="size-4" icon="gravity-ui:trash-bin" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        <Table.Footer>
          <Pagination size="sm">
            <Pagination.Summary>
              {start} to {end} of {users.length} results
            </Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={page === 1}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <Pagination.PreviousIcon />
                  Prev
                </Pagination.Previous>
              </Pagination.Item>
              {pages.map((p) => (
                <Pagination.Item key={p}>
                  <Pagination.Link
                    isActive={p === page}
                    onPress={() => setPage(p)}
                  >
                    {p}
                  </Pagination.Link>
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Next
                  isDisabled={page === totalPages}
                  onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </Table.Footer>
      </Table>
    </div>
  );
}

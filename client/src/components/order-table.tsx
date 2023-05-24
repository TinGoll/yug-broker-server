import {
  FormControl,
  FormLabel,
  Select,
  Sheet,
  Input,
  IconButton,
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Divider,
  Button,
  Box,
  Table,
  Checkbox,
  Chip,
  ColorPaletteProp,
  Avatar,
  iconButtonClasses,
} from "@mui/joy";
import Option from "@mui/joy/Option";
import React from "react";
import Link from "@mui/joy/Link";

const rows = [
  {
    id: "25656",
    date: "01.02.2022",
    status: "В работе",
    customer: {
      initial: "O",
      name: "Гаджиев Ашот",
      email: "ashot@email.com",
    },
    subscription: "Успеть к свадьбе",
  },
  {
    id: "25656",
    date: "01.02.2022",
    status: "В работе",
    customer: {
      initial: "O",
      name: "Гаджиев Ашот",
      email: "ashot@email.com",
    },
    subscription: "Успеть к свадьбе",
  },
  {
    id: "25256",
    date: "01.05.2022",
    status: "Завис",
    customer: {
      initial: "Б",
      name: "Бесланов Аслан",
      email: "ashot@email.com",
    },
    subscription: "Успеть к свадьбе",
  },
  {
    id: "22656",
    date: "01.05.2022",
    status: "На отдыхе",
    customer: {
      initial: "В",
      name: "Сагаджиев Амет",
      email: "ashot@email.com",
    },
    subscription: "Успеть к свадьбе",
  },
  {
    id: "25656",
    date: "01.02.2022",
    status: "В работе",
    customer: {
      initial: "O",
      name: "Гаджиев Ашот",
      email: "ashot@email.com",
    },
    subscription: "Успеть к свадьбе",
  },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function OrderTable() {
  const [order, setOrder] = React.useState<Order>("desc");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const renderFilters = () => (
    <React.Fragment>
      <FormControl size='sm'>
        <FormLabel>Статус</FormLabel>
        <Select placeholder='Выбрать статус' slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}>
          <Option value='В работе'>В работе</Option>
          <Option value='На отдыхе'>На отдыхе</Option>
          <Option value='Завис'>Завис</Option>
          <Option value='Отвис'>Отвис</Option>
        </Select>
      </FormControl>

      <FormControl size='sm'>
        <FormLabel>Категория</FormLabel>
        <Select placeholder='Все'>
          <Option value='Все'>Все</Option>
        </Select>
      </FormControl>

      <FormControl size='sm'>
        <FormLabel>Клиент</FormLabel>
        <Select placeholder='Все'>
          <Option value='Все'>Все</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <Sheet
        className='SearchAndFilters-mobile'
        sx={{
          display: {
            xs: "flex",
            sm: "none",
          },
          my: 1,
          gap: 1,
        }}
      >
        <Input size='sm' placeholder='Search' startDecorator={<i data-feather='search' />} sx={{ flexGrow: 1 }} />
        <IconButton size='sm' variant='outlined' color='neutral' onClick={() => setOpen(true)}>
          <i data-feather='filter' />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby='filter-modal' layout='fullscreen'>
            <ModalClose />
            <Typography id='filter-modal' level='h2'>
              Фильтры
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {renderFilters()}
              <Button color='primary' onClick={() => setOpen(false)}>
                Поехали
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className='SearchAndFilters-tabletUp'
        sx={{
          borderRadius: "sm",
          py: 2,
          display: {
            xs: "none",
            sm: "flex",
          },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: {
              xs: "120px",
              md: "160px",
            },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size='sm'>
          <FormLabel>Найти заказы</FormLabel>
          <Input placeholder='Search' startDecorator={<i data-feather='search' />} />
        </FormControl>

        {renderFilters()}
      </Box>
      <Sheet
        className='OrderTableContainer'
        variant='outlined'
        sx={{
          width: "100%",
          borderRadius: "md",
          flex: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby='tableTitle'
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground": (theme) => theme.vars.palette.background.level1,
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": (theme) => theme.vars.palette.background.level1,
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: "center", padding: 12 }}>
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length !== rows.length}
                  checked={selected.length === rows.length}
                  onChange={(event) => {
                    setSelected(event.target.checked ? rows.map((row) => row.id) : []);
                  }}
                  color={selected.length > 0 || selected.length === rows.length ? "primary" : undefined}
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </th>
              <th style={{ width: 140, padding: 12 }}>
                <Link
                  underline='none'
                  color='primary'
                  component='button'
                  onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                  fontWeight='lg'
                  endDecorator={<i data-feather='arrow-down' />}
                  sx={{
                    "& svg": {
                      transition: "0.2s",
                      transform: order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                    },
                  }}
                >
                  Invoice
                </Link>
              </th>
              <th style={{ width: 120, padding: 12 }}>Дата</th>
              <th style={{ width: 120, padding: 12 }}>Статус</th>
              <th style={{ width: 220, padding: 12 }}>Клиент</th>
              <th style={{ width: 120, padding: 12 }}>Инфо</th>
              <th style={{ width: 160, padding: 12 }}> </th>
            </tr>
          </thead>
          <tbody>
            {stableSort(rows, getComparator(order, "id")).map((row) => (
              <tr key={row.id}>
                <td style={{ textAlign: "center" }}>
                  <Checkbox
                    checked={selected.includes(row.id)}
                    color={selected.includes(row.id) ? "primary" : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked ? ids.concat(row.id) : ids.filter((itemId) => itemId !== row.id)
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                    sx={{ verticalAlign: "text-bottom" }}
                  />
                </td>
                <td>
                  <Typography fontWeight='md'>{row.id}</Typography>
                </td>
                <td>{row.date}</td>
                <td>
                  <Chip
                    variant='soft'
                    size='sm'
                    startDecorator={
                      {
                        "В работе": <i data-feather='check' />,
                        "На отдыхе": <i data-feather='corner-up-left' />,
                        "Завис": <i data-feather='x' />,
                      }[row.status]
                    }
                    color={
                      {
                        "В работе": "success",
                        "На отдыхе": "neutral",
                        "Завис": "danger",
                      }[row.status] as ColorPaletteProp
                    }
                  >
                    {row.status}
                  </Chip>
                </td>
                <td>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Avatar size='sm'>{row.customer.initial}</Avatar>
                    <div>
                      <Typography fontWeight='lg' level='body3' textColor='text.primary'>
                        {row.customer.name}
                      </Typography>
                      <Typography level='body3'>{row.customer.email}</Typography>
                    </div>
                  </Box>
                </td>
                <td>{row.subscription}</td>
                <td>
                  <Link fontWeight='lg' component='button' color='neutral'>
                    В архив
                  </Link>
                  <Link fontWeight='lg' component='button' color='primary' sx={{ ml: 2 }}>
                    Открыть
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <Box className='Pagination-mobile' sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
        <IconButton aria-label='previous page' variant='outlined' color='neutral' size='sm'>
          <i data-feather='arrow-left' />
        </IconButton>
        <Typography level='body2' mx='auto'>
          Страницы 1 of 10
        </Typography>
        <IconButton aria-label='next page' variant='outlined' color='neutral' size='sm'>
          <i data-feather='arrow-right' />
        </IconButton>
      </Box>
      <Box
        className='Pagination-laptopUp'
        sx={{
          pt: 4,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        <Button size='sm' variant='plain' color='neutral' startDecorator={<i data-feather='arrow-left' />}>
          Предыдущая
        </Button>

        <Box sx={{ flex: 1 }} />
        {["1", "2", "3", "…", "8", "9", "10"].map((page) => (
          <IconButton key={page} size='sm' variant={Number(page) ? "outlined" : "plain"} color='neutral'>
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />

        <Button size='sm' variant='plain' color='neutral' endDecorator={<i data-feather='arrow-right' />}>
          Следующая
        </Button>
      </Box>
    </React.Fragment>
  );
}

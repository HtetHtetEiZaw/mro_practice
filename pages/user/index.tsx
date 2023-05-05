import type { NextPage } from "next";
import Link from "next/link";
import React from "react";

import Button from "@mui/material/Button";

import useSWR, { mutate } from "swr";
import { Prisma } from "@prisma/client";

/*  Material-UI  import */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

//icons
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { fetcher } from "@/utils/fetcher";

const UserList: NextPage = () => {
  type UserPayload = Prisma.UserGetPayload<{
    include: {
      role: true;
      department: true;
    };
  }>;
  const { data: users, error } = useSWR<UserPayload[]>("/api/user", fetcher);

  const onDelete = async (id: string) => {
    const response = await fetch(`/api/user/${id}`, {
      method: "DELETE",
    });
    mutate("/api/user");
  };

  if (error) return <div>An error has occurred.</div>;
  if (!users) return <div>Loading...</div>;

  return (
    <>
      <Link href="/user/create" passHref>
        <Button variant="contained" color="primary">
          <PersonAddIcon /> Create User
        </Button>
      </Link>
      <div>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>name</TableCell>
              <TableCell>email</TableCell>
              <TableCell>role</TableCell>
              <TableCell>department</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
           
            {users?.map((user: UserPayload) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role.name}</TableCell>
                  <TableCell>{user.department.name}</TableCell>
                  <TableCell>
                    <Link href={`/user/edit/${user.id}`} passHref>
                      <Button variant="contained" color="primary">
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => onDelete(user.id)}
                      variant="contained"
                      color="warning"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default UserList;

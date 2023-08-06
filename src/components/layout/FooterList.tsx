import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { PageLinks } from "~/types/layout.types";

interface IFooterListProps {
  title: string;
  links: PageLinks[];
}

const FooterList: React.FC<IFooterListProps> = ({ title, links }) => {
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Box component="ul">
        {links.map((p, i) => (
          <Box component="li" key={`${title}-${i}`}>
            <Link href={p.link}>
              <Typography
                sx={(theme) => ({
                  cursor: "pointer",
                  "&:hover": {
                    color: theme.palette.secondary.main,
                  },
                })}
              >
                {p.name}
              </Typography>
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FooterList;

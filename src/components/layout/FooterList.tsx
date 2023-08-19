import { Box } from "@mui/material";
import { PageLinks } from "@src/types/layout.types";
import { ArcaneLink } from "../ArcaneLink";

interface IFooterListProps {
  links: PageLinks[];
}

const FooterList: React.FC<IFooterListProps> = ({ links }) => {
  return (
    <Box component="ul">
      {links.map((p, i) => (
        <Box component="li" key={`footerlist-${i}`}>
          <ArcaneLink href={p.link}>{p.name.toLowerCase()}</ArcaneLink>
        </Box>
      ))}
    </Box>
  );
};

export default FooterList;

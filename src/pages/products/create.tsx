import {
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { IProductCreateRequestBody } from "~/types/product.types";
import { createProduct } from "~/utils/product";

interface CreateProductProps {}

const CreateProduct: React.FC<CreateProductProps> = () => {
  const [productInfo, setProductInfo] = useState<IProductCreateRequestBody>({
    name: "",
    active: true,
    description: "",
    images: [],
    priceInDollars: 0,
    unit_label: "",
    category: undefined,
    inventory: undefined,
  });

  const handleSubmit =
    (
      props: IProductCreateRequestBody
    ): React.FormEventHandler<HTMLFormElement> =>
    (event) => {
      event?.preventDefault();

      createProduct(props).then(console.log).catch(console.error);
    };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(productInfo)}
      direction="column"
      spacing={2}
      margin={20}
    >
      <TextField
        required
        label="Name"
        value={productInfo.name}
        onChange={(event) =>
          setProductInfo({
            ...productInfo,
            name: event.target?.value || "",
          })
        }
      />
      <TextField
        required
        label="Description"
        multiline
        rows={3}
        value={productInfo.description}
        onChange={(event) =>
          setProductInfo({
            ...productInfo,
            description: event.target?.value || "",
          })
        }
      />
      <FormControlLabel
        control={
          <Switch
            defaultChecked
            onChange={(event) =>
              setProductInfo({
                ...productInfo,
                active: event.target.checked,
              })
            }
            value={productInfo.active}
          />
        }
        label="Active"
      />
      <TextField
        required
        label="Price"
        type="number"
        value={productInfo.priceInDollars}
        onChange={(event) => {
          setProductInfo({
            ...productInfo,
            priceInDollars: event.target?.value
              ? parseFloat(event.target?.value)
              : 0,
          });
        }}
      />
      <TextField
        required
        label="Unit Label"
        value={productInfo.unit_label}
        onChange={(event) =>
          setProductInfo({
            ...productInfo,
            unit_label: event.target?.value || "",
          })
        }
      />
      <TextField
        label="Category"
        value={productInfo.category}
        onChange={(event) =>
          setProductInfo({
            ...productInfo,
            category: event.target?.value,
          })
        }
      />
      <TextField
        label="Inventory"
        type="number"
        value={productInfo.inventory}
        onChange={(event) =>
          setProductInfo({
            ...productInfo,
            inventory: event.target?.value
              ? parseInt(event.target?.value)
              : undefined,
          })
        }
      />

      <Button type="submit">Submit</Button>
    </Stack>
  );
};

export default CreateProduct;

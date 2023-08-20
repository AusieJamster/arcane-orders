import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import GenericAutocomplete from "@src/components/formComponents/GenericAutocomplete";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ECardAttribute,
  ECardLinkArrows,
  ECardRarity,
  ECardSet,
  ECardType,
  EMonsterType,
  TPostUploadImageFile,
  productCreateCardFormSchema,
  productCreateMonsterFormSchema,
} from "@src/types/product.types";
import FileUploadField from "@src/components/formComponents/FileUploadField/FileUploadField";
import axios from "axios";
import { useRouter } from "next/router";

interface CreateProductProps {}

const CreateProduct: React.FC<CreateProductProps> = ({}) => {
  const router = useRouter();

  const [isMonster, setIsMonster] = useState<boolean>(false);

  const [images, setImages] = useState<TPostUploadImageFile[]>([]);
  const [imageErrors, setImageErrors] = useState<string | null>(null);
  const [primaryIdx, setPrimaryIdx] = useState<string>("0");
  const [imageAltText, setImageAltText] = useState<string[]>([]);

  const handleRemoveImage = (index: number) => {
    axios
      .delete(`/api/deleteImages`, {
        data: [images[index].key],
      })
      .then(() => {
        setImageErrors(null);
        setImages((prev) => {
          prev.splice(index, 1);
          return [...prev];
        });
      })
      .catch((err) => {
        console.error(err);
        setImageErrors("Error removing image");
      });
  };

  const handleFileChange = (files: TPostUploadImageFile[]) => {
    if (files.length < 1) {
      setImages([]);
      return;
    }

    if (files.length + images.length > 8) {
      setImageErrors("Cannot have more than 8 images");
      return;
    }

    const fileMap = new Map();
    [...images, ...files].forEach((file) => fileMap.set(file.key, file));

    setImageErrors(null);
    setImages(Array.from(fileMap.values()).slice(0, 8));
  };

  const {
    control,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      isMonster ? productCreateMonsterFormSchema : productCreateCardFormSchema
    ),
    defaultValues: {
      active: true,
      priceInDollars: undefined,
      unit_label: undefined,
      inventory: undefined,

      title: undefined,
      set: undefined,
      productIdentifier: undefined,
      rarity: undefined,
      imgs: [],
      description: undefined,
      attribute: undefined,
      subclass: undefined,

      level: undefined,
      attackValue: undefined,
      defenseValue: undefined,
      monsterType: EMonsterType.NORMAL,
      hasEffect: undefined,
      linkRating: undefined,
      linkArrows: undefined,
    },
  });

  const handleImageAltUpdate = (idx: number, altText: string) => {
    setImageAltText((prev) => {
      prev[idx] = altText;
      return [...prev];
    });
  };

  const onSubmit = (data: any) => {
    const validator = isMonster
      ? productCreateMonsterFormSchema
      : productCreateCardFormSchema;

    const cardData = validator.safeParse(data);

    if (cardData.success) {
      console.log(cardData.data);
    } else {
      console.warn(cardData.error);
      throw new Error("Invalid form data");
    }

    // TODO: upload these images to the server
    const imgObjs = images.map((img, i) => ({
      alt: imageAltText[i],
      url: img.url,
      isPrimary: img.key === images[parseInt(primaryIdx)].key,
    }));

    axios
      .put("/api/products/create", { ...cardData.data, imgs: imgObjs })
      .then((res) => {
        router.push(`/products/${cardData.data.productIdentifier}`);
      })
      .catch((err) => {
        console.error(err.response.data);
      });
  };

  return (
    <Stack
      component="form"
      maxWidth={1300}
      marginX="auto"
      marginY={5}
      spacing={5}
      onSubmit={handleSubmit(onSubmit, (data) => console.error(data))}
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h4">General Info</Typography>
      <Grid
        width="100%"
        container
        spacing={0}
        id="general-info"
        justifyContent="center"
        alignItems="center"
        rowGap={2}
      >
        <Grid item xs={12} sm={6} md={4} xl={3}>
          <FormControlLabel
            control={<Switch {...register("active")} defaultChecked />}
            label="Active Product"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={3}>
          <FormControl error={!!errors.priceInDollars?.message} fullWidth>
            <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              placeholder="18.89"
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              label="Amount"
              {...register("priceInDollars", {
                required: true,
                valueAsNumber: true,
              })}
            />
            <FormHelperText>{errors.priceInDollars?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} xl={3}>
          <TextField
            fullWidth
            error={!!errors.unit_label?.message}
            helperText={errors.unit_label?.message}
            label="Unit Label"
            placeholder="card"
            {...register("unit_label", { required: true })}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={3}>
          <TextField
            fullWidth
            error={!!errors.inventory?.message}
            helperText={errors.inventory?.message}
            label="Inventory"
            placeholder="10"
            {...register("inventory", { required: true, valueAsNumber: true })}
          />
        </Grid>
        <Grid item xs={11}>
          <FileUploadField
            imageErrorsUpdate={setImageErrors}
            primaryIdx={primaryIdx}
            primaryIdxUpdate={setPrimaryIdx}
            imageUpdate={handleFileChange}
            imageRemove={handleRemoveImage}
            images={images}
            imageErrors={imageErrors}
            imageAltText={imageAltText}
            handleImageAltUpdate={handleImageAltUpdate}
          />
        </Grid>
      </Grid>
      <Divider sx={{ width: "80%" }} />
      <Typography variant="h4">Card Information</Typography>
      <Grid
        width="100%"
        container
        spacing={0}
        id="card-info"
        justifyContent="center"
        alignItems="center"
        rowGap={2}
      >
        <Grid item xs={12} sm={6} md={4} xl={3}>
          <TextField
            fullWidth
            error={!!errors.title?.message}
            helperText={errors.title?.message}
            label="Title"
            placeholder="Salamangreat of Fire"
            {...register("title", { required: true })}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={3}>
          <GenericAutocomplete<ECardSet, false>
            control={control}
            label={"Set"}
            options={Object.values(ECardSet)}
            fieldKey="set"
            errorMessage={errors.set?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={3}>
          <TextField
            fullWidth
            label="Card Number"
            placeholder="LD10-EN001"
            error={!!errors.productIdentifier?.message}
            helperText={errors.productIdentifier?.message}
            {...register("productIdentifier", { required: true })}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={3}>
          <GenericAutocomplete<ECardRarity>
            fieldKey="rarity"
            control={control}
            label={"Rarity"}
            options={Object.values(ECardRarity)}
            errorMessage={errors.rarity?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} xl={3}>
          <GenericAutocomplete<ECardAttribute>
            control={control}
            label={"Attribute"}
            options={Object.values(ECardAttribute)}
            fieldKey="attribute"
            errorMessage={errors.attribute?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={3}>
          <GenericAutocomplete<ECardType>
            control={control}
            label={"Card Type"}
            options={Object.values(ECardType)}
            fieldKey="subclass"
            errorMessage={errors.subclass?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            placeholder='If this card is Normal or Special Summoned: You can add 1 Level 4 or lower "Salamangreat" monster from your Deck to your hand, except "Salamangreat of Fire", also you cannot Special Summon monsters for the rest of this turn, except FIRE monsters. At the start of the Damage Step, if a Cyberse monster you control battles: You can banish this card from your GY; destroy that monster you control. You can only use each effect of "Salamangreat of Fire" once per turn.'
            multiline
            error={!!errors.description?.message}
            helperText={errors.description?.message}
            {...register("description", { required: true })}
          />
        </Grid>
      </Grid>
      <Divider sx={{ width: "80%" }} />
      <Typography variant="h4">Monster Information</Typography>
      <Grid
        width="100%"
        container
        spacing={0}
        id="monster-info"
        justifyContent="center"
        alignItems="center"
        rowGap={2}
      >
        <Grid item xs={12} sm={6} md={4} xl={3}>
          <FormControlLabel
            control={
              <Switch
                onChange={(e, checked) => setIsMonster(checked)}
                value={isMonster}
              />
            }
            label="Is Monster"
          />
        </Grid>
        {isMonster && (
          <>
            <Grid item xs={12} sm={6} md={4} xl={3}>
              <TextField
                fullWidth
                label="Level"
                placeholder="4"
                error={!!errors.level?.message}
                helperText={errors.level?.message}
                {...register("level", { required: true, valueAsNumber: true })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} xl={3}>
              <TextField
                fullWidth
                label="Attack Value"
                placeholder="2000"
                error={!!errors.attackValue?.message}
                helperText={errors.attackValue?.message}
                {...register("attackValue", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} xl={3}>
              <TextField
                fullWidth
                label="Defense Value"
                placeholder="2000"
                error={!!errors.defenseValue?.message}
                helperText={errors.defenseValue?.message}
                {...register("defenseValue", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} xl={3}>
              <GenericAutocomplete<EMonsterType>
                fieldKey="monsterType"
                control={control}
                label={"Monster Type"}
                options={Object.values(EMonsterType)}
                errorMessage={errors.monsterType?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} xl={3}>
              <FormControlLabel
                control={<Switch {...register("hasEffect")} defaultChecked />}
                label="Has Effect"
              />
            </Grid>
            {watch("monsterType") === EMonsterType.LINK && (
              <>
                <Grid item xs={12} sm={6} md={4} xl={3}>
                  <TextField
                    label="Link Rating"
                    placeholder="4"
                    error={!!errors.linkRating?.message}
                    helperText={errors.linkRating?.message}
                    {...register("linkRating", {
                      required: true,
                      setValueAs: (v) => parseInt(v) || undefined,
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} xl={3}>
                  <GenericAutocomplete<ECardLinkArrows, true>
                    multiple
                    fieldKey="linkArrows"
                    label={"Link Arrows"}
                    options={Object.values(ECardLinkArrows)}
                    control={control}
                    errorMessage={errors.linkArrows?.message}
                  />
                </Grid>
              </>
            )}
          </>
        )}
      </Grid>
      <Divider sx={{ width: "80%" }} />
      <Button fullWidth variant="contained" type="submit">
        Submit
      </Button>
    </Stack>
  );
};

export default CreateProduct;

const { ethers } = require("hardhat");
const { CRYPTODEVS_NFT_CONTRACT_ADDRESS } = require("../constants/constants");

async function main() {
  // Deploy the FakeNFTMarketplace contract first
  const FakeNFTMarketplace = await ethers.getContractFactory(
    "FakeNFTMarketplace"
  );
  const gasPrice = await FakeNFTMarketplace.signer.getGasPrice();
    console.log(`Current gas price: ${gasPrice}`);
  const estimatedGas = await FakeNFTMarketplace.signer.estimateGas(
    FakeNFTMarketplace.getDeployTransaction()
  );
  console.log(`Estimated gas: ${estimatedGas}`);

  const deploymentPrice = gasPrice.mul(estimatedGas);
  const deployerBalance = await FakeNFTMarketplace.signer.getBalance();
  console.log(
    `Deployer balance:  ${ethers.utils.formatEther(deployerBalance)}`
  );
  console.log(
    `Deployment price:  ${ethers.utils.formatEther(deploymentPrice)}`
  );
  if (deployerBalance.lt(deploymentPrice)) {
    throw new Error(
      `Insufficient funds. Top up your account balance by ${ethers.utils.formatEther(
        deploymentPrice.sub(deployerBalance)
      )}`
    );
  }

  const fakeNftMarketplace = await FakeNFTMarketplace.deploy();
  await fakeNftMarketplace.deployed();

  console.log("FakeNFTMarketplace deployed to: ", fakeNftMarketplace.address);


  const CryptoDevsDAO = await ethers.getContractFactory("CryptoDevsDAO");
    const cryptoDevsDaoGasPrice = await CryptoDevsDAO.signer.getGasPrice();
    console.log(`Current gas price: ${cryptoDevsDaoGasPrice}`);
    const cryptoDevsDaoEstimatedGas = await CryptoDevsDAO.signer.estimateGas(
      CryptoDevsDAO.getDeployTransaction(
        fakeNftMarketplace.address,
        CRYPTODEVS_NFT_CONTRACT_ADDRESS
      )
    );
    console.log(`Estimated gas: ${cryptoDevsDaoEstimatedGas}`);

    const cryptoDevsDaoDeploymentPrice = gasPrice.mul(
      cryptoDevsDaoEstimatedGas
    );
    const cryptoDevsDaoDeployerBalance =
      await CryptoDevsDAO.signer.getBalance();
    console.log(
      `Deployer balance:  ${ethers.utils.formatEther(
        cryptoDevsDaoDeployerBalance
      )}`
    );
    console.log(
      `Deployment price:  ${ethers.utils.formatEther(
        cryptoDevsDaoDeploymentPrice
      )}`
    );
    if (cryptoDevsDaoDeployerBalance.lt(cryptoDevsDaoDeploymentPrice)) {
      throw new Error(
        `Insufficient funds. Top up your account balance by ${ethers.utils.formatEther(
          cryptoDevsDaoDeploymentPrice.sub(cryptoDevsDaoDeployerBalance)
        )}`
      );
    }
  const cryptoDevsDAO = await CryptoDevsDAO.deploy(
    fakeNftMarketplace.address,
    CRYPTODEVS_NFT_CONTRACT_ADDRESS,
    {
      
      value: ethers.utils.parseEther("0.1"),
    }
  );
  await cryptoDevsDAO.deployed();

  console.log("CryptoDevsDAO deployed to: ", cryptoDevsDAO.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  // FakeNFTMarketplace deployed to:  0xCB5cB11ceDd01C65f0046ce45C5668C84B3ad1A1
  // CryptoDevsDAO deployed to:  0x6f9F0905B706A467422DeeB9AB6DEa4fF4095F1d
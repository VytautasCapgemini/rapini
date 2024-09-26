import ts from "typescript";
import { CLIOptions } from "../cli";

function makeImportAxiosInstanceTypeDeclaration() {
  return ts.factory.createImportDeclaration(
    /*modifiers*/ undefined,
    /*importClause*/ ts.factory.createImportClause(
      /*isTypeOnly*/ true,
      /*name*/ undefined,
      /*namedBindings*/ ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(
          /*isTypeOnly*/ false,
          /*propertyName*/ undefined,
          /*name*/ ts.factory.createIdentifier("AxiosInstance")
        ),
        ts.factory.createImportSpecifier(
          /*isTypeOnly*/ false,
          /*propertyName*/ undefined,
          /*name*/ ts.factory.createIdentifier("AxiosRequestConfig")
        ),
      ])
    ),
    /*moduleSpecifier*/ ts.factory.createStringLiteral("axios"),
    /*assertClause*/ undefined
  );
}

function makeImportReactQueryDeclaration() {
  const importClause = ts.factory.createImportClause(
    /*typeOnly*/ false,
    /*name*/ undefined,
    /*namedBindings*/ ts.factory.createNamedImports([
      ts.factory.createImportSpecifier(
        /*typeOnly*/ false,
        /*propertyName*/ undefined,
        /*name*/ ts.factory.createIdentifier("useQuery")
      ),
      ts.factory.createImportSpecifier(
        /*typeOnly*/ false,
        /*propertyName*/ undefined,
        /*name*/ ts.factory.createIdentifier("useMutation")
      ),
      ts.factory.createImportSpecifier(
        /*typeOnly*/ false,
        /*propertyName*/ undefined,
        /*name*/ ts.factory.createIdentifier("useQueryClient")
      ),
      ts.factory.createImportSpecifier(
        /*typeOnly*/ true,
        /*propertyName*/ undefined,
        /*name*/ ts.factory.createIdentifier("QueryClient")
      ),
      ts.factory.createImportSpecifier(
        /*typeOnly*/ true,
        /*propertyName*/ undefined,
        /*name*/ ts.factory.createIdentifier("MutationObserverOptions")
      ),
      ts.factory.createImportSpecifier(
        /*typeOnly*/ true,
        /*propertyName*/ undefined,
        /*name*/ ts.factory.createIdentifier("UseQueryOptions")
      ),
      ts.factory.createImportSpecifier(
        /*typeOnly*/ true,
        /*propertyName*/ undefined,
        /*name*/ ts.factory.createIdentifier("MutationFunction")
      ),
      ts.factory.createImportSpecifier(
        /*typeOnly*/ true,
        /*propertyName*/ undefined,
        /*name*/ ts.factory.createIdentifier("UseMutationReturnType")
      ),
      ts.factory.createImportSpecifier(
        /*typeOnly*/ true,
        /*propertyName*/ undefined,
        /*name*/ ts.factory.createIdentifier("UseQueryReturnType")
      ),
    ])
  );

  return ts.factory.createImportDeclaration(
    /*modifers*/ undefined,
    /*importClause*/ importClause,
    /*moduleSpecifier*/ ts.factory.createStringLiteral("@tanstack/vue-query"),
    /*assertClause*/ undefined
  );
}

export function makeImports(options: CLIOptions) {
  return [
    makeImportAxiosInstanceTypeDeclaration(),
    makeImportReactQueryDeclaration(),
  ];
}

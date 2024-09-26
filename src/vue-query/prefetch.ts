import ts from "typescript";
import type { OpenAPIV3 } from "openapi-types";
import SwaggerParser from "@apidevtools/swagger-parser";
import {
  capitalizeFirstLetter,
  normalizeOperationId,
  createParams,
} from "../common/util";
import { RAPINI_MUTATION_ID } from "./rapini-mutation";

export function makePrefetches(
  $refs: SwaggerParser.$Refs,
  paths: OpenAPIV3.PathsObject
) {
    const properties = Object.entries(paths)
        .filter(([_, item]) => !!item?.get)
        .map(([pattern, item]) =>
            makeProperty($refs, pattern, item!.get, item!.parameters)
        );

  const requestsParam = ts.factory.createParameterDeclaration(
    /*modifiers*/ undefined,
    /*dotDotDotToken*/ undefined,
    /*name*/ ts.factory.createIdentifier("requests"),
    /*questionToken*/ undefined,
    /*type*/ ts.factory.createTypeReferenceNode(
      /*typeName*/ ts.factory.createIdentifier("Requests"),
      /*typeArgs*/ undefined
    ),
    /*initializer*/ undefined
  );

  const configParam = ts.factory.createParameterDeclaration(
    /*modifiers*/ undefined,
    /*dotDotDotToken*/ undefined,
    /*name*/ ts.factory.createIdentifier("config"),
    /*questionToken*/ ts.factory.createToken(ts.SyntaxKind.QuestionToken),
    /*type*/ ts.factory.createIndexedAccessTypeNode(
      /*objectType*/ ts.factory.createTypeReferenceNode(
        /*typeName*/ ts.factory.createIdentifier("Config"),
        /*typeArgs*/ undefined
      ),
      /*indexType*/ ts.factory.createLiteralTypeNode(
        ts.factory.createStringLiteral("prefetches")
      )
    ),
    /*initializer*/ undefined
  );

  return [
    ts.factory.createTypeAliasDeclaration(
      /*modifiers*/ undefined,
      /*name*/ ts.factory.createIdentifier("PrefetchesConfigs"),
      /*typeParameters*/ undefined,
      /*type*/ ts.factory.createTypeLiteralNode(properties.map((p) => p.config))
    ),
    ts.factory.createFunctionDeclaration(
      /*modifiers*/ undefined,
      /*asteriskToken*/ undefined,
      /*name*/ ts.factory.createIdentifier("makePrefetches"),
      /*typeParameters*/ undefined,
      /*parameters*/ [requestsParam, configParam],
      /*type*/ undefined,
      /*body*/ ts.factory.createBlock(
        [
          ts.factory.createReturnStatement(
            ts.factory.createAsExpression(
              /*expression*/ ts.factory.createObjectLiteralExpression(
                properties.map((p) => p.property),
                /*multiline*/ true
              ),
              /*type*/ ts.factory.createTypeReferenceNode(
                /*typeName*/ ts.factory.createIdentifier("const"),
                /*typeArgs*/ undefined
              )
            )
          ),
        ],
        /*multiline*/ true
      )
    ),
  ];
}

function optionsParameterDeclaration(
  requestIdentifier: string,
  hasRequestBody: boolean
) {
  return ts.factory.createParameterDeclaration(
    /*modifiers*/ undefined,
    /*dotDotDotToken*/ undefined,
    /*name*/ ts.factory.createIdentifier("options"),
    /*questionToken*/ ts.factory.createToken(ts.SyntaxKind.QuestionToken),
    /*type*/ ts.factory.createTypeReferenceNode(
      /*typeName*/ ts.factory.createIdentifier("Omit"),
      /*typeArguments*/ [
        ts.factory.createTypeReferenceNode(
          /*typeName*/ ts.factory.createIdentifier("MutationObserverOptions"),
          /*typeArguments*/ [
            ts.factory.createTypeReferenceNode(
              /*typeName*/ ts.factory.createIdentifier("Response"),
              /*typeArguments*/ [
                ts.factory.createLiteralTypeNode(
                  ts.factory.createStringLiteral(requestIdentifier)
                ),
              ]
            ),
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
            hasRequestBody
              ? ts.factory.createIndexedAccessTypeNode(
                  /*objectType*/ ts.factory.createTypeReferenceNode(
                    /*typeName*/ ts.factory.createIdentifier("Parameters"),
                    /*typeArguments*/ [
                      ts.factory.createIndexedAccessTypeNode(
                        ts.factory.createTypeReferenceNode(
                          ts.factory.createIdentifier("Requests"),
                          undefined
                        ),
                        ts.factory.createLiteralTypeNode(
                          ts.factory.createStringLiteral(requestIdentifier)
                        )
                      ),
                    ]
                  ),
                  /*indexType*/ ts.factory.createLiteralTypeNode(
                    /*literal*/ ts.factory.createNumericLiteral(
                      /*value*/ "0",
                      /*numericLiteralFlags*/ undefined
                    )
                  )
                )
              : ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
          ]
        ),
        ts.factory.createLiteralTypeNode(
          /*literal*/ ts.factory.createStringLiteral("mutationFn")
        ),
      ]
    ),
    /*initializer*/ undefined
  );
}

function makeProperty(
    $refs: SwaggerParser.$Refs,
    pattern: string,
    operation: OpenAPIV3.PathItemObject["get"],
    pathParams: OpenAPIV3.PathItemObject["parameters"]
): { property: ts.PropertyAssignment; config: ts.TypeElement } {
  const operationId = operation?.operationId;
  if (!operationId) {
    throw `Missing "operationId" from GET request with pattern ${pattern}`;
  }
  const normalizedOperationId = normalizeOperationId(operationId);

  const identifier = `use${capitalizeFirstLetter(normalizedOperationId)}`;
  const params = createParams($refs, operation, pathParams);

  const hasRequestBody = !!operation.requestBody;

  const body = /*expression*/ ts.factory.createCallExpression(
    /*expression*/ ts.factory.createIdentifier(RAPINI_MUTATION_ID),
    /*typeArguments*/ [
      ts.factory.createTypeReferenceNode(
        /*typeName*/ ts.factory.createIdentifier("Response"),
        /*typeArgs*/ [
          ts.factory.createLiteralTypeNode(
            ts.factory.createStringLiteral(normalizedOperationId)
          ),
        ]
      ),
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
      hasRequestBody
        ? ts.factory.createIndexedAccessTypeNode(
            /*objectType*/ ts.factory.createTypeReferenceNode(
              /*typeName*/ ts.factory.createIdentifier("Parameters"),
              /*typeArguments*/ [
                ts.factory.createIndexedAccessTypeNode(
                  ts.factory.createTypeReferenceNode(
                    ts.factory.createIdentifier("Requests"),
                    undefined
                  ),
                  ts.factory.createLiteralTypeNode(
                    ts.factory.createStringLiteral(normalizedOperationId)
                  )
                ),
              ]
            ),
            /*indexType*/ ts.factory.createLiteralTypeNode(
              /*literal*/ ts.factory.createNumericLiteral(
                /*value*/ "0",
                /*numericLiteralFlags*/ undefined
              )
            )
          )
        : ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
    ],
    /*args*/ [
      ts.factory.createArrowFunction(
        /*modifiers*/ undefined,
        /*typeParameters*/ undefined,
        /*parameters*/ hasRequestBody
          ? [
              ts.factory.createParameterDeclaration(
                /*modifiers*/ undefined,
                /*dotDotDotToken*/ undefined,
                /*name*/ ts.factory.createIdentifier("payload"),
                /*questionToken*/ undefined,
                /*type*/ undefined,
                /*initializer*/ undefined
              ),
            ]
          : [],
        /*type*/ undefined,
        /*equalsGreaterThanToken*/ ts.factory.createToken(
          ts.SyntaxKind.EqualsGreaterThanToken
        ),
        /*body*/ ts.factory.createCallExpression(
          /*expression*/ ts.factory.createPropertyAccessExpression(
            /*expression*/ ts.factory.createIdentifier("requests"),
            /*name*/ ts.factory.createIdentifier(normalizedOperationId)
          ),
          /*typeArguments*/ undefined,
          /*args*/ hasRequestBody
            ? [
                ts.factory.createIdentifier("payload"),
                ...params.map((p) => p.name),
              ]
            : params.map((p) => p.name)
        )
      ),
      ts.factory.createPropertyAccessChain(
        /*expression*/ ts.factory.createIdentifier("config"),
        /*questionDotToken*/ ts.factory.createToken(
          ts.SyntaxKind.QuestionDotToken
        ),
        /*name*/ ts.factory.createIdentifier(identifier)
      ),
      ts.factory.createIdentifier("options"),
    ]
  );

  return {
    property: ts.factory.createPropertyAssignment(
      /*name*/ ts.factory.createIdentifier(identifier),
      /*initializer*/ ts.factory.createArrowFunction(
        /*modifiers*/ undefined,
        /*typeParameters*/ undefined,
        /*parameters*/ [
          ...params.map((p) => p.arrowFuncParam),
          optionsParameterDeclaration(normalizedOperationId, hasRequestBody),
        ],
        /*type*/ undefined,
        /*equalsGreaterThanToken*/ ts.factory.createToken(
          ts.SyntaxKind.EqualsGreaterThanToken
        ),
        /*body*/ body
      )
    ),
    config: ts.factory.createPropertySignature(
      undefined,
      ts.factory.createIdentifier(identifier),
      ts.factory.createToken(ts.SyntaxKind.QuestionToken),
      ts.factory.createFunctionTypeNode(
        undefined,
        [
          ts.factory.createParameterDeclaration(
            undefined,
            undefined,
            ts.factory.createIdentifier("queryClient"),
            undefined,
            ts.factory.createTypeReferenceNode(
              ts.factory.createIdentifier("QueryClient"),
              undefined
            ),
            undefined
          ),
        ],
        ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier("Pick"),
          [
            ts.factory.createTypeReferenceNode(
              ts.factory.createIdentifier("MutationObserverOptions"),
              [
                ts.factory.createTypeReferenceNode(
                  ts.factory.createIdentifier("Response"),
                  [
                    ts.factory.createLiteralTypeNode(
                      ts.factory.createStringLiteral(normalizedOperationId)
                    ),
                  ]
                ),
                ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
                hasRequestBody
                  ? ts.factory.createIndexedAccessTypeNode(
                      ts.factory.createTypeReferenceNode(
                        ts.factory.createIdentifier("Parameters"),
                        [
                          ts.factory.createIndexedAccessTypeNode(
                            ts.factory.createTypeReferenceNode(
                              ts.factory.createIdentifier("Requests"),
                              undefined
                            ),
                            ts.factory.createLiteralTypeNode(
                              ts.factory.createStringLiteral(
                                normalizedOperationId
                              )
                            )
                          ),
                        ]
                      ),
                      ts.factory.createLiteralTypeNode(
                        ts.factory.createNumericLiteral("0")
                      )
                    )
                  : ts.factory.createKeywordTypeNode(
                      ts.SyntaxKind.UnknownKeyword
                    ),
                ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
              ]
            ),
            ts.factory.createUnionTypeNode([
              ts.factory.createLiteralTypeNode(
                ts.factory.createStringLiteral("onSuccess")
              ),
              ts.factory.createLiteralTypeNode(
                ts.factory.createStringLiteral("onSettled")
              ),
              ts.factory.createLiteralTypeNode(
                ts.factory.createStringLiteral("onError")
              ),
            ]),
          ]
        )
      )
    ),
  };
}
